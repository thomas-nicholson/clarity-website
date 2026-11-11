# Clarity website verification

## Published website

**Live:** https://teejay.dev/clarity-website/ — GitHub Pages, HTTPS enforced, source `main:/` in public `thomas-nicholson/clarity-website`.

Executable website source: `c5fc3ec1f6afeac9a38dc9c1dc699c73cbc5bd64`. GitHub Pages build/deployment `43077203669` completed successfully for that exact commit. Parent verified all 25 remote source blobs against the local Git tree and all 15 deployed runtime HTML/CSS/JS/image/SEO files byte-for-byte over HTTPS. Later documentation-only recording commits do not change this executable source.

A real browser opened the live homepage, verified both exact Google Play links and disabled Chrome/Firefox controls, then clicked the iPhone CTA into the actual hosted form. Two genuine form submissions using one controlled reserved-domain address both showed accepted status. Private database readback verified exactly one durable row, consent/source and 365-day retention, private0700/0600 modes and the installed backend source hash. The controlled entry was specifically removed and absence read back. No address/nonce appeared in scoped service journals; no mail was sent. No real subscriber rows were read or exported for this test.

## Local browser qualification

**48 checks passed**, Chromium 148.0.7778.96; no uncaught browser JavaScript errors.16 actual screenshot artifacts were retained privately outside public source. Firefox was **not run**: no cached Playwright Firefox executable. Safari/physical-device qualification remains open.

- Home/iPhone viewports 320/375/414/768/1440 CSS pixels, plus 375px at 200% root text: no horizontal overflow/clipped tested controls, images loaded, measured primary control/label hit targets at least 44×44px.
- Privacy/support/404 overflow at 320/375/414/768; internal links, metadata and SEO assets; nested404 home navigation.
- Correct Play href and real iPhone navigation; genuinely disabled coming-soon extension controls.
- Required email/consent validation, missing/invalid configuration refuses dispatch, no-JS native submission disabled, keyboard skip link and reduced motion.
- Owned scripted HTTP fixtures, **not production-backend evidence**: captured exact payload, honeypot, pending/duplicate lock, acceptance/retry,400/429/500/201, malformed/negative JSON, connection/CORS/body-timeout failures, no browser-storage signup or automatic retry.
- Parent reproduced an editable-email-during-pending defect, then fixed it: email/consent are locked to the submitted request and restored on failure. The full 48-check suite passed after the repair. Finished forms do not validate cleared disabled fields as a new error.
- Production waitlist CSP allows only the real HTTPS API. Only the local test fixture server substitutes its own loopback transport policy; this is not deployed.

## Backend and privacy boundaries

The separate privately operated API passed 18 real HTTP/SQLite tests, including restart durability, deduplication, limits and origin/lookalike checks. Its source/state is not published here. Public form validation does not verify mailbox ownership. Confirmation/launch-mail delivery, campaign operations and real inbox handling were not exercised. Retention cleanup is scheduled/bounded, not guaranteed at an exact second; outages/backlogs can delay removal. Existing Android privacy URLs are preserved.

## Design review

Actual desktop/mobile/tablet/enlarged-text renders were inspected. Clarity's locked system typography/palette, restrained spacing, real owned native Android View renders with demo content, no fake phone/browser chrome, fabricated proof or false store availability. Brand tokens intentionally override generic Hallmark catalog preferences; this is not a claim of passing every generic style gate.

Evidence is retained privately under the website-and-sync research directory and task-owned screenshot directories. Local fixture results, hosted signup verification, Android blocking, browser-extension blocking and signed/store distribution are distinct acceptance categories. This website publication does not release iPhone, enable cross-device Sync or submit either browser extension.
