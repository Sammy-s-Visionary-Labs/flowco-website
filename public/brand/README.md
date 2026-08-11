# Ohio Flow Co logo exports

These SVGs are extracted from the vector artwork on page 2 of the August 2026
brand guidelines. They are self-contained paths and do not require a font file
at runtime.

The primary-logo descriptor is:

> SEWER, WATER, DRAINAGE & EXCAVATION

- `logo-primary.svg`: Trench Green and Excavation Gold for light surfaces.
- `logo-primary-reverse.svg`: Porcelain and Excavation Gold for dark surfaces.
- `logo-monogram.svg`: Standard horizontal OFC monogram.
- `logo-monogram-reverse.svg`: Reversed horizontal OFC monogram.
- `logo-mark.svg`: Standard standalone valve-and-pipe mark.
- `logo-mark-reverse.svg`: Reversed standalone mark.

Regenerate the exports with:

```sh
python3 scripts/brand/extract_logos.py \
  /path/to/OFC-brand-guidelines.pdf \
  public/brand
```
