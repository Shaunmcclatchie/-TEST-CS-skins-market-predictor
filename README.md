# SKIN / SIGNAL

A Counter-Strike 2 market research dashboard built with React, TypeScript and Vinext.

Live site: https://cs-market-terminal.equalmorel11.chatgpt.site

## Run locally

Requires Node.js 22.13 or newer and npm.

```sh
npm run install:ci
npm run dev
```

Open the local URL printed by the dev server. The Sites integration supplies a local test identity.

```sh
npm run build
npx tsc --noEmit
```

If the Windows npm launcher fails, invoke npm's JavaScript entrypoint directly:

```powershell
node 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run install:ci
node scripts/run-framework.mjs dev
node scripts/run-framework.mjs build
```

## Features

- Skinport public USD pricing and sales-summary APIs with a server-side five-minute cache.
- Searchable screener, wear variants, category/price filters and CSV export.
- Cost-adjusted research signals with freshness, liquidity, anomaly and minimum-margin checks.
- Browser-local watchlists, refresh-time targets and manually entered portfolio positions.
- CSV-trained ridge AR(5), log-linear trend and last-price forecasts with chronological holdout evaluation.

## Source map

- `app/page.tsx`: dashboard UI and browser-local state.
- `app/globals.css`: responsive styling.
- `app/api/market/route.ts`: API proxy and cache.
- `lib/forecast.ts`: CSV validation, models and rolling-origin evaluation.
- `public/snapshot.json`: timestamped fallback snapshot, not a live feed.
- `build/` and `scripts/`: retained Sites/Vinext runtime and build integration.
- `.openai/hosting.json`: existing private Site identity; do not reuse for an unrelated deployment.

## Data and model limitations

No API key is required for the connected Skinport endpoints. Other marketplaces are not connected. Skinport sales windows overlap and are not daily observations. Forecasting requires imported CSV with `date,price` columns, USD prices for one exact item, and at least 90 consecutive daily observations. Longer horizons can require more observations for enough holdout windows.

Buy/wait/avoid screens are explicit valuation rules, separate from ML predictions. Individual float, stickers, pattern premiums, trade restrictions and taxes are not modeled. Default fees and slippage are editable assumptions. Returns are not guaranteed.

Watchlists, portfolio entries, targets and imported history stay in browser local storage. Alerts are checked on refresh, not by a background service. No orders are placed.

## Repository hygiene

Dependencies, builds, runtime state and environment files are ignored. The lockfile and public market snapshot are included. No private repository credentials are included. Third-party license files are retained.
