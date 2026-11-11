# Local verification

Final local browser suite: **48 checks passed** in Chromium 148.0.7778.96. No uncaught browser JavaScript errors. Firefox was **not run**: no installed/cached Playwright Firefox binary was present; no download was attempted.

- Home and iPhone pages: real CSS viewports 320, 375, 414, 768 and 1440 px; additional 375 px at 200% root text. Verified no document horizontal overflow, visible headings/controls within the viewport, loaded images, and measured primary control/label targets at least 44 × 44 px.
- Privacy, support and 404: document overflow checked at 320, 375, 414 and 768 px. Routes, internal links, canonical/description/OG metadata and static SEO assets checked. A nested 404 served the branded page and its real Home link worked.
- Real browser navigation from the home iPhone CTA; exact Google Play href; truly disabled Chrome/Firefox controls.
- Accessible email/consent errors; missing/invalid config prevented requests and success; no-JavaScript fallback; keyboard skip link and reduced-motion behavior.
- **Task-owned scripted HTTP fixtures, not a production backend:** exact JSON payload, honeypot preservation, delayed submitting state, duplicate-tap lock, accepted and already-registered acknowledgements, no email echo/browser storage, HTTP 400/429/500/201, malformed/negative JSON, broken connection, denied CORS and a response-body timeout. Success only followed HTTP 200 + `accepted: true`.
- Computed token contrast checks: ink/paper 16.61:1; muted/paper 7.05:1; light/navy 16.72:1; dark-muted/navy 11.14:1; link/paper 4.81:1; focus/paper 4.82:1; focus/navy 3.47:1; error/surface 8.02:1; success/surface 7.22:1; field boundary/surface 4.76:1.

Actual browser PNGs and JSON results/source inventory are stored outside this public source tree. Rerun the documented test command to create your own evidence directory. Final evidence is local, not hosted acceptance or device blocking acceptance.

## Design review

Hallmark Workbench + N9/Ft2, with Clarity’s locked palette/system type; no invented proof or re-drawn chrome. Inspected actual desktop/mobile/tablet, form success and enlarged-text captures. Shortened FAQ controls, adjusted enlarged heading wrapping and repaired a skip-link sliver exposed at enlarged text. Layout uses semantic HTML, hairlines and whitespace rather than decorative effects. Brand-specific system typography/exact white/hex tokens are documented exceptions to Hallmark catalog preferences; no claim of passing every generic catalog gate is made.

## Remaining launch gates

- Real private waitlist service, correct CORS and idempotent/deduplicated acceptance.
- Actual provider/retention/deletion information in website privacy; working support/removal process.
- Public API base in `assets/config.js`, then real hosted form verification.
- GitHub repository/Pages publication and readback, including intended canonical/subpath and custom 404.
- Firefox/Safari/device-browser smoke if required for the release matrix.

No GitHub repository, provider/backend, account, payment, Android release or extension modification was created by this site task.
