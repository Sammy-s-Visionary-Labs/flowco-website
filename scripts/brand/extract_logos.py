#!/usr/bin/env python3
"""Extract Ohio Flow Co vector marks from the brand-guide PDF.

The source artwork on PDF page 2 is already vector geometry. This script keeps
that geometry intact, replaces the outlined legacy descriptor with an outlined
Source Sans 3 descriptor that includes excavation, and writes self-contained
SVG assets with no runtime font dependency.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
from dataclasses import dataclass
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Iterable
from xml.sax.saxutils import escape

from pypdf import PdfReader
from pypdf.generic import ContentStream


BEDROCK = "#2b2825"
TRENCH_GREEN = "#4d5442"
EXCAVATION_GOLD = "#d3a956"
PORCELAIN = "#f7eddf"
DESCRIPTOR = "SEWER, WATER, DRAINAGE & EXCAVATION"


@dataclass(frozen=True)
class PaintedPath:
    index: int
    data: str
    fill: str
    fill_rule: str


def multiply(left: tuple[float, ...], right: tuple[float, ...]) -> tuple[float, ...]:
    a1, b1, c1, d1, e1, f1 = left
    a2, b2, c2, d2, e2, f2 = right
    return (
        a1 * a2 + b1 * c2,
        a1 * b2 + b1 * d2,
        c1 * a2 + d1 * c2,
        c1 * b2 + d1 * d2,
        e1 * a2 + f1 * c2 + e2,
        e1 * b2 + f1 * d2 + f2,
    )


def transform(matrix: tuple[float, ...], x: float, y: float) -> tuple[float, float]:
    a, b, c, d, e, f = matrix
    return a * x + c * y + e, b * x + d * y + f


def fmt(value: float) -> str:
    rounded = f"{value:.3f}".rstrip("0").rstrip(".")
    return "0" if rounded in {"-0", ""} else rounded


def point(matrix: tuple[float, ...], x: float, y: float) -> str:
    px, py = transform(matrix, x, y)
    return f"{fmt(px)} {fmt(py)}"


def source_color(operator: bytes, values: Iterable[float]) -> str:
    numbers = tuple(round(float(value), 3) for value in values)
    if operator == b"rg":
        if numbers in {(0.3, 0.33, 0.26), (0.302, 0.329, 0.259)}:
            return TRENCH_GREEN
        return "#%02x%02x%02x" % tuple(round(channel * 255) for channel in numbers)
    if operator == b"k" and numbers == (0.18, 0.32, 0.78, 0.0):
        return EXCAVATION_GOLD
    raise ValueError(f"Unexpected logo color {operator!r} {numbers!r}")


def extract_painted_paths(reader: PdfReader) -> list[PaintedPath]:
    page = reader.pages[1]
    stream = ContentStream(page["/Contents"].get_object(), reader)
    state = {
        "ctm": (1.0, 0.0, 0.0, 1.0, 0.0, 0.0),
        "fill_operator": b"rg",
        "fill_values": (0.0, 0.0, 0.0),
    }
    stack: list[dict[str, object]] = []
    current: list[str] = []
    paths: list[PaintedPath] = []
    paint_index = 0

    for operands, operator in stream.operations:
        if operator == b"q":
            stack.append(state.copy())
        elif operator == b"Q":
            state = stack.pop()
        elif operator == b"cm":
            matrix = tuple(float(value) for value in operands)
            state["ctm"] = multiply(matrix, state["ctm"])
        elif operator in {b"rg", b"k"}:
            state["fill_operator"] = operator
            state["fill_values"] = tuple(float(value) for value in operands)
        elif operator == b"m":
            matrix = state["ctm"]
            current.append(f"M{point(matrix, float(operands[0]), float(operands[1]))}")
        elif operator == b"l":
            matrix = state["ctm"]
            current.append(f"L{point(matrix, float(operands[0]), float(operands[1]))}")
        elif operator == b"c":
            matrix = state["ctm"]
            controls = [
                point(matrix, float(operands[offset]), float(operands[offset + 1]))
                for offset in (0, 2, 4)
            ]
            current.append("C" + " ".join(controls))
        elif operator == b"re":
            matrix = state["ctm"]
            x, y, width, height = (float(value) for value in operands)
            corners = [
                point(matrix, x, y),
                point(matrix, x + width, y),
                point(matrix, x + width, y + height),
                point(matrix, x, y + height),
            ]
            current.extend([f"M{corners[0]}", *(f"L{corner}" for corner in corners[1:]), "Z"])
        elif operator == b"h":
            current.append("Z")
        elif operator in {b"f", b"F", b"f*"}:
            if current:
                paths.append(
                    PaintedPath(
                        index=paint_index,
                        data="".join(current),
                        fill=source_color(state["fill_operator"], state["fill_values"]),
                        fill_rule="evenodd" if operator == b"f*" else "nonzero",
                    )
                )
                paint_index += 1
            current = []
        elif operator in {b"S", b"s", b"B", b"B*", b"b", b"b*", b"n"}:
            if current and operator != b"n":
                paint_index += 1
            current = []

    return paths


def embedded_descriptor_font(reader: PdfReader) -> bytes:
    page = reader.pages[3]
    font = page["/Resources"]["/Font"]["/T1_2"].get_object()
    font_file = font["/FontDescriptor"].get_object()["/FontFile3"].get_object()
    if font_file.get("/Subtype") != "/Type1C":
        raise ValueError("Expected embedded Source Sans 3 Semibold Type1C data")
    return font_file.get_data()


def compile_font_outliner(source: Path, output: Path) -> None:
    temp_dir = Path("/private/tmp/ofc-clang-temp")
    temp_dir.mkdir(parents=True, exist_ok=True)
    environment = os.environ.copy()
    environment["CLANG_MODULE_CACHE_PATH"] = "/private/tmp/ofc-clang-modules"
    environment["TMPDIR"] = str(temp_dir)
    subprocess.run(
        [
            "clang",
            "-framework",
            "AppKit",
            "-framework",
            "CoreText",
            str(source),
            "-o",
            str(output),
        ],
        check=True,
        env=environment,
    )


def descriptor_outline(outliner: Path, font: Path) -> dict[str, object]:
    process = subprocess.run(
        [str(outliner), str(font), DESCRIPTOR, "2.1"],
        check=True,
        capture_output=True,
        text=True,
    )
    result = json.loads(process.stdout)
    if not result["path"] or result["bbox"][2] <= 0 or result["bbox"][3] <= 0:
        raise ValueError("The embedded descriptor font did not produce a usable outline")
    return result


def svg_path(path: PaintedPath, color_map: dict[str, str]) -> str:
    fill = color_map.get(path.fill, path.fill)
    rule = "" if path.fill_rule == "nonzero" else ' fill-rule="evenodd"'
    return f'    <path fill="{fill}"{rule} d="{path.data}"/>'


def write_svg(
    output: Path,
    *,
    title: str,
    crop: tuple[float, float, float, float],
    paths: Iterable[PaintedPath],
    color_map: dict[str, str],
    descriptor: dict[str, object] | None = None,
) -> None:
    x, y, width, height = crop
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(width)} {fmt(height)}" role="img" aria-labelledby="title">',
        f"  <title id=\"title\">{escape(title)}</title>",
        f'  <g transform="translate(0 {fmt(height)}) scale(1 -1) translate({fmt(-x)} {fmt(-y)})">',
        *(svg_path(path, color_map) for path in paths),
        "  </g>",
    ]

    if descriptor is not None:
        bx, by, bw, bh = (float(value) for value in descriptor["bbox"])
        target_left = 11.5
        target_top = 384.0
        target_width = 553.0
        target_height = 31.5
        scale_x = target_width / bw
        scale_y = target_height / bh
        target_bottom = target_top + target_height
        descriptor_fill = color_map.get(TRENCH_GREEN, TRENCH_GREEN)
        lines.append(
            "  <path "
            f'fill="{descriptor_fill}" '
            f'transform="translate({fmt(target_left)} {fmt(target_bottom)}) '
            f'scale({fmt(scale_x)} {fmt(-scale_y)}) '
            f'translate({fmt(-bx)} {fmt(-by)})" '
            f'd="{descriptor["path"]}"/>'
        )

    lines.extend(["</svg>", ""])
    output.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument(
        "--font-outliner-source",
        type=Path,
        default=Path(__file__).with_name("font-outline.m"),
    )
    args = parser.parse_args()

    reader = PdfReader(args.pdf)
    paths = extract_painted_paths(reader)
    expected_indices = set(range(2, 41))
    if not expected_indices.issubset({path.index for path in paths}):
        raise ValueError("The PDF logo-system page does not match the expected vector structure")

    with TemporaryDirectory(prefix="ofc-brand-") as temporary_directory:
        build_dir = Path(temporary_directory)
        font_path = build_dir / "SourceSans3-Semibold.cff"
        outliner_path = build_dir / "font-outline"
        font_path.write_bytes(embedded_descriptor_font(reader))
        compile_font_outliner(args.font_outliner_source, outliner_path)
        descriptor = descriptor_outline(outliner_path, font_path)

    args.output.mkdir(parents=True, exist_ok=True)
    by_index = {path.index: path for path in paths}
    primary = [by_index[index] for index in range(8, 24)]
    monogram = [by_index[index] for index in range(4, 8)]
    mark = [by_index[index] for index in range(2, 4)]

    standard = {TRENCH_GREEN: TRENCH_GREEN, EXCAVATION_GOLD: EXCAVATION_GOLD}
    reverse = {TRENCH_GREEN: PORCELAIN, EXCAVATION_GOLD: EXCAVATION_GOLD}

    write_svg(
        args.output / "logo-primary.svg",
        title=f"Ohio Flow Co - {DESCRIPTOR.title()}",
        crop=(260.0, 250.0, 576.0, 512.0),
        paths=primary,
        color_map=standard,
        descriptor=descriptor,
    )
    write_svg(
        args.output / "logo-primary-reverse.svg",
        title=f"Ohio Flow Co - {DESCRIPTOR.title()}",
        crop=(260.0, 250.0, 576.0, 512.0),
        paths=primary,
        color_map=reverse,
        descriptor=descriptor,
    )
    write_svg(
        args.output / "logo-monogram.svg",
        title="Ohio Flow Co monogram",
        crop=(1070.0, 566.0, 518.0, 207.0),
        paths=monogram,
        color_map=standard,
    )
    write_svg(
        args.output / "logo-monogram-reverse.svg",
        title="Ohio Flow Co monogram",
        crop=(1070.0, 566.0, 518.0, 207.0),
        paths=monogram,
        color_map=reverse,
    )
    write_svg(
        args.output / "logo-mark.svg",
        title="Ohio Flow Co logo mark",
        crop=(1070.0, 260.0, 197.0, 197.0),
        paths=mark,
        color_map=standard,
    )
    write_svg(
        args.output / "logo-mark-reverse.svg",
        title="Ohio Flow Co logo mark",
        crop=(1070.0, 260.0, 197.0, 197.0),
        paths=mark,
        color_map=reverse,
    )


if __name__ == "__main__":
    main()
