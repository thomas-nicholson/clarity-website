# Independent deployment and future product domain

## Repository boundary

This is the standalone promotional website repository: `thomas-nicholson/clarity-website`.

- Publish this repository's root as static files. There is no production build, framework server or dependency on the Android/extension checkout.
- All runtime assets are committed here. Node/Playwright are development-only test tools; `package-lock.json` belongs to this repository.
- The public waitlist API is a separate service configured through `assets/config.js`. Subscriber records, backend source, credentials and private logs never belong here.
- This repository is not the Android app, browser extension, future iPhone application, subscription authority or payment webhook service. Those have independent delivery/security boundaries.

## Current live deployment

GitHub Pages publishes `main:/` with HTTPS enforced at `https://teejay.dev/clarity-website/`. The project currently inherits the existing user-site domain and has no project-specific `CNAME`. The Android privacy site is separate and must remain available.

The new product domain has not yet been supplied. Do not invent a hostname, purchase a domain, change DNS or replace the existing user-site domain as a shortcut.

The site source is standalone now, but its absolute metadata and error-page links still intentionally use the current project address. A new domain requires the explicit migration below; it is not already configured.

Choose the deployment host separately from the Git repository. Before adding a commercial checkout/account portal, account for GitHub Pages' published restrictions on sites primarily facilitating commercial transactions or commercial SaaS. This is a future-hosting caveat, not a finding that the current free project-promotion page violates the policy.[6]

## Cutover once the owner supplies the domain

1. Confirm the exact canonical hostname, who controls its DNS, and the intended static host. Retain the current live site while preparing the replacement.
2. If retaining GitHub Pages, configure the custom domain on **this repository**, not the user-site repository. Follow GitHub's current domain-verification, DNS and HTTPS instructions. With the current branch-publishing mode, setting the custom domain creates a root `CNAME` commit; an Actions-based publishing setup has different CNAME handling.[1]
3. Update canonical URLs, Open Graph/Twitter image/page URLs and `sitemap.xml` across `index.html`, `iphone/index.html`, `privacy/index.html`, `support/index.html` and `404.html`. Review `robots.txt` for the host root.
4. Update every project-prefixed `/clarity-website/` asset/navigation link in `404.html` for the new root. Normal nested-page relative assets must also be exercised at the new address. Update the browser fixture's deployment prefix and metadata expectations rather than making a test silently accept any origin.
5. Keep the waitlist service separate. Add the **exact new HTTPS origin** to its server-side CORS allowlist before routing signups there. Preserve the old allowed origin during migration; never use a wildcard. The public API URL can remain unchanged. If changing it, update `assets/config.js` and the iPhone page's exact CSP connection allowance together.
6. Preserve the existing Android privacy URL and verified Play link. Do not change Android billing/release settings or publish unavailable iPhone/extension links as part of a domain change.
7. Deploy and verify the actual canonical hostname, HTTPS, old-address behavior, all images, homepage/download CTAs, privacy/support, and a genuinely missing nested route using the 404 page.
8. Repeat the real hosted waitlist journey with one controlled reserved-domain QA address, including duplicate submission. An authorized operator must verify durability privately and remove only that QA row with readback. Do not inspect/export real subscribers or publish QA payloads.
9. Record the exact tested/deployed source and retain the old domain until redirects, API allowlists and privacy links are confirmed. A domain change does not activate billing or customer Sync.

## Standalone development verification

From this repository, with Node/npm installed:

```sh
npm ci
npx playwright install chromium
EVIDENCE_DIR=../clarity-website-evidence npm test
```

The browser harness serves this checkout itself; it does not require a sibling Android or extension repository. Optional `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` overrides can reuse an existing test installation. Keep evidence outside the public repository. Its scripted local API is not proof that the real signup service accepts a newly configured origin.

## Source provenance

Repository/deployment observations above were read back from the actual checkout and GitHub Pages settings on 12 November 2026. Future DNS/hostname changes remain owner-input dependent; none was performed by this document.

## Sources

[1] https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
[6] https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
