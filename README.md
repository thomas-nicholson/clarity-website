# Clarity website

Static promotional site at **https://teejay.dev/clarity-website/**, published from the public `thomas-nicholson/clarity-website` GitHub Pages project. No runtime framework, analytics, advertising trackers, cookies, external fonts or payments. The existing Android privacy site is separate and preserved.

## Public routes

- `/clarity-website/`: Android promotion and verified Google Play link, iPhone waitlist link, disabled Chrome/Firefox coming-soon locations.
- `/clarity-website/iphone/`: iPhone launch-notification form.
- `/clarity-website/privacy/`: website/waitlist handling and original Android policy link.
- `/clarity-website/support/`: existing public support contact.
- Nested missing routes use `404.html` and project-prefixed assets.

Metadata, Open Graph assets and sitemap currently use the inherited custom-domain origin `https://teejay.dev`. This repository deploys independently of the native app and browser extension. A separate product domain is planned; do not change the existing user-site domain or guess a project CNAME before the owner supplies the hostname. See [independent deployment and domain cutover](DEPLOYMENT.md). `.nojekyll` disables Jekyll processing. Project `robots.txt` is not the host-root robots policy.

## Private waitlist integration

`assets/config.js` configures the public base **https://clarity-api.tjagent.cc**. It is not a secret. Never put credentials in public source. Private backend source/state, subscriber records, rate-limit salt and logs must remain outside this repository.

The client appends `/v1/waitlist` and explicitly submits JSON:

```json
{"email":"you@example.com","source":"iphone","consent":true,"website":""}
```

Only HTTP 200 with `{"accepted":true}` confirms acceptance. New and existing addresses receive the same response without an address. SQLite commit precedes acceptance; retrying does not duplicate or extend retention. No confirmation email is sent. The backend permits only the exact owned GitHub/custom origins, validates consent/honeypot/schema, rate-limits requests and stores private records with scheduled 365-day cleanup. Removal is available through the published support contact and private operator CLI. The privacy page describes actual behavior, including delayed cleanup after outages/backlogs.

The form sends no cookies/credentials, rejects redirects, bounds the request/body deadline to 12 seconds, locks duplicate taps, does not save addresses in browser storage and never auto-retries. Native submission stays disabled until JavaScript initializes. Missing config and ambiguous failures never claim a saved signup. Production HTML permits connections only to the actual API; other pages permit no fetch connections.

## Local preview and tests

From the parent directory run `python3 -m http.server 8080 --bind 127.0.0.1`, then open `http://127.0.0.1:8080/clarity-website/`. This is a layout preview: the production API intentionally denies arbitrary localhost origins.

Playwright is development-only. This repository has its own package and lockfile; no sibling checkout is required:

```sh
npm ci
npx playwright install chromium
EVIDENCE_DIR=../clarity-website-evidence npm test
```

Optional `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` overrides may reuse an existing package/browser without creating a production dependency.

The harness starts actual owned HTTP servers for the static site and scripted API fixtures. Only that fixture server substitutes the loopback API config and relaxes the waitlist page's connection policy to its own ephemeral API port. Production files retain the exact HTTPS allowlist. These are UI/HTTP-fixture tests, not live-backend proof. The separately recorded hosted-form journey must prove production integration.

Checks cover 320/375/414/768/1440 CSS pixels, 200% text, real links, metadata, invalid inputs/consent, in-flight lock, exact payload, success/retry, HTTP/network/CORS/body-timeout failures, disabled extensions, no-JS guidance and keyboard/reduced-motion behavior. Firefox absence is reported, never counted as a pass. JSON results/screenshots stay outside the public source tree.

## Assets and availability

See `ASSET-PROVENANCE.md`. Owned Android UI renders use demo sessions, not fake phone frames or user history. Preserve the locked `tokens.css`/`assets/site.css` system. Do not advertise iPhone/store-extension availability, working cross-device Sync, final subscriptions, fabricated metrics or testimonials. Replace coming-soon controls only with verified signed/store distribution destinations.
