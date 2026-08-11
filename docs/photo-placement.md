# Photo placement review

This review covers every raster image in `assets/old-website-images`. The source
archive remains untracked and is not shipped with the site. Only the six selected
images are re-encoded as optimized WebP derivatives in `public/work`.

## Implemented placement map

| Source | Page | Location | Reason |
| --- | --- | --- | --- |
| 004 | Sewer line repair | Service scope introduction | Authentic tight-access residential excavation that supports repair work without overstating the exact method. |
| 007 | Sewer line replacement | Service scope introduction; homepage field gallery | Clear view of new green sewer pipe being placed in a residential trench. |
| 010 | About | Company introduction | Equipment in transport communicates field readiness and mobilization without tying the image to one service. |
| 011 | Stormwater and drainage | Service scope introduction | Precast structure and crane work best represent larger drainage infrastructure. |
| 017 | Excavation and trenching | Service scope introduction; homepage field gallery | Strong, authentic equipment photo at a residential work site. |
| 020 | Commercial | Service scope introduction; homepage field gallery | Commercial-scale crane and precast work clearly distinguishes the partner/project pathway. |

The water-service-line page intentionally has no supplied photo. None of the
authentic images clearly proves water-line work, and using a sewer or generic
AI image there would be misleading.

## One-by-one asset review

| # | Visual assessment | Decision and best fit |
| --- | --- | --- |
| 001 | Flooded or surcharging manhole beneath a parked car; generic stock appearance. | Exclude. It could illustrate a drainage warning sign, but ownership is unclear and the image is overly alarming for current page content. |
| 002 | Overhead view of two workers heat-fusing black pipe; polished stock appearance. | Hold. Potential water-line or commercial fit only after ownership and project authenticity are confirmed. |
| 003 | Aerial winter shoreline or ice pattern. | Exclude as unrelated to Ohio Flow Co services. |
| 004 | Excavator working beside a residential trench in a tight yard. | Select for sewer line repair. The scene is authentic and the restricted access supports the page story. |
| 005 | Operator using an asphalt roller, framed through another machine cab. | Hold. Authentic field work, but paving/restoration is not a confirmed core service and the portrait is less direct than the selected set. |
| 006 | Wide residential sewer installation with green pipe, cleanouts, trench, and crew. | Hold. Strong sewer-replacement content, but visible mailbox/property detail and third-party clothing make 007 a cleaner choice. |
| 007 | Portrait view down a residential trench with green sewer pipe and crew. | Select for sewer line replacement and the homepage field gallery. |
| 008 | Low-resolution basement floor demolition video still. | Exclude for quality and because it reads as general indoor plumbing. |
| 009 | Indoor plumber inspecting an implausible pipe assembly; synthetic appearance. | Exclude. It is visually synthetic and outside the underground-service focus. |
| 010 | Komatsu excavator secured on a transport trailer. | Select for About to communicate mobilization and field capability. |
| 011 | Crane and crew positioning a large precast concrete structure. | Select for stormwater and drainage. |
| 012 | Excavation barriers and road signs with incoherent lettering; synthetic appearance. | Exclude. |
| 013 | Previous raster Ohio Flow Co logo with the old “sewage” descriptor. | Exclude. It conflicts with the approved current SVG brand system and descriptor. |
| 014 | Excavator in a desert or palm-tree setting; synthetic appearance. | Exclude. The setting is not credible for Northwest Ohio. |
| 015 | Close overhead view of white PVC and cleanout components in an excavation. | Hold. Authentic detail, but the service and stage of work are too ambiguous for a primary page image. |
| 016 | Three workers around an incoherent commercial pipe scene; synthetic appearance. | Exclude. |
| 017 | Two compact excavators staged on gravel beside a residence. | Select for excavation and trenching and the homepage field gallery. |
| 018 | Illustrated excavator graphic with old branding and copy errors. | Exclude. It conflicts with the current identity and photography-led direction. |
| 019 | Worker inspecting or clearing a manhole with cable equipment. | Hold. Authentic and useful for sewer investigation, but it could imply drain-cleaning services beyond the current confirmed scope. |
| 020 | Crane crew handling precast structures at a commercial site. | Select for Commercial and the homepage field gallery. |
| 021 | Residential green-pipe trench with a survey pole and third-party engineering truck. | Hold. Strong process evidence, but third-party branding and identifiable property context make 007 preferable. |
| 022 | Low-angle excavator and pipe trench; synthetic appearance. | Exclude. |
| 023 | Worker placing black pipe in a garden trench; synthetic stock appearance. | Exclude. |
| 024 | Worker and surveying equipment looking into an implausible tunnel; synthetic appearance. | Exclude. |
| 025 | Excavator at an active urban residential site with a person posing beside it. | Hold. Authentic, but the composition and visible safety presentation are weaker than 017. |
| 026 | Large open-pit desert excavation; synthetic appearance. | Exclude. It misrepresents the company’s local utility scale and setting. |
| 027 | Attributed stock photo of water discharging from a pipe into a pond. | Exclude. It is not an Ohio Flow Co project and reuse rights need separate verification. |
| 028 | Attributed stock close-up of a sewer cover. | Exclude. It adds little project credibility and reuse rights need separate verification. |

## Publishing safeguards

- The archive notes that ownership or license transfer was not independently
  verified. Confirm that Ohio Flow Co owns or may reuse the six selected photos
  before merging this review branch into production.
- Several originals contain EXIF data and five contain GPS coordinates. The
  build script rotates from source orientation, re-encodes to WebP, and does not
  copy source metadata into the public derivatives.
- Captions and alternative text describe only what is visible. They do not claim
  a precise city, customer, crew identity, or completed outcome.
- Rebuild the derivatives with `node scripts/photos/build-photo-assets.mjs` after
  any approved source-image changes.
