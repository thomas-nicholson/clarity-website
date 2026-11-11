# Owned assets and design provenance

- Brand reference: Clarity browser extension `DESIGN.md`, “Visual system (locked)”, preserving the Android paper `#F4F7FB`, navy `#0A172A`, system sans, hairlines and restrained spacing.
- Structure: Hallmark Workbench, H2 split diptych; N9 edge-aligned minimal header; Ft2 inline footer. Real app imagery does the explaining. The tour becomes linear on small screens. No imitated device/browser frames, invented proof, decorative gradients, shadows or downloaded stock assets.
- Nocturne Signal principles retained: editorial hierarchy, no clutter, no overlaps, unaltered actual UI. Its dark/lime palette does not override Clarity’s locked brand.
- Exact legacy hex values and system fonts intentionally override Hallmark’s catalog/OKLCH/font-pairing preferences. These are brand continuity, not a new theme.

## Application images

`assets/weekly-planner.png` and `assets/session-targets.png` are byte-identical copies of existing Clarity marketing captures. They are **Robolectric native Android View renders**, not physical-device or emulator screenshots and not evidence of installed-device blocking. Producer: `com.thom.clarity.MarketingCaptureTest.realMarketingSurfacesRenderWithSafeDemoData`, native graphics, API 36, content viewport 824 × 1100. The real production activities/layouts render fictional demo scheduling. Existing app pixels, including its own UI treatment, remain untouched.

| Asset | SHA-256 |
| --- | --- |
| `weekly-planner.png` | `7b557c2257a41e6d4cbc19fc9a08c252184d11c52d3f33a6489632ace1401d76` |
| `session-targets.png` | `21f3e8e27010cd10ae53828bf33eef4b6ba59ffa53acceb3b3c7be5efb4a409b` |
| `icon.png` | `fd4003965f0d413647fcd9dd47eecd119c711e2f16912fb317edac3f16d2abf7` |

The planner’s partially visible next day and the editor’s scrolled position are genuine viewports, not cropped/redrawn marketing UI. These captures show an earlier Android interface; adjacent copy describes only verified current features and does not call the images the latest release. The older Temporary Unblock marketing panel is deliberately excluded.

`assets/icon.png` is the existing, unchanged Clarity store icon. `assets/og.png` is an original static composition of that owned icon and plain type, rendered with the locally installed DejaVu Sans family. No font files or external assets are redistributed. Runtime typography uses system fonts only.

## Public links

The exact official Play URL is `https://play.google.com/store/apps/details?id=com.thom.clarity`. A direct HTTP GET during implementation returned 200, title “Clarity - Apps on Google Play”, and app heading “Clarity”. That confirms this listing, not any user’s region/device eligibility or exact release track.

The existing Android policy URL `https://teejay.dev/clarity-privacy/` is preserved. Its published support email, `changeengine64@gmail.com`, is used here. This site does not alter the original privacy repository, policy or old URLs.

## Verification boundaries

Browser screenshots/test results are produced outside this public source tree. Form-success tests use explicitly scripted, task-owned local HTTP server fixtures; they are **not** evidence of a real waitlist provider. Those gates were subsequently completed by the parent: see `VERIFICATION.md` for the actual hosted form, private readback and exact-source deployment evidence. Local fixture results remain a separate evidence category.
