# Blitzr.Fun

A token launchpad UI built with permanent, one-sided liquidity as the pitch: launch a token, trade it, track your portfolio, and browse platform-wide analytics.

## Stack

- React 19 + TypeScript
- Vite

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Structure

```
src/
  theme.ts          color palette (dark/light) + hues
  data.ts            token seed data + formatting/chart helpers
  audio.ts            Web Audio "spark"/"blitz" sound effects
  types.ts           shared types
  AppContext.tsx      theme + spark-click context
  App.tsx             top-level state (page, wallet, launch wizard, per-token overrides)
  components/         Nav, TokenCard, SparkOverlay
  pages/               Explore, TokenDetail, Launch, Portfolio, Analytics, Legal
```

## Pages

- **Explore** — browse launched and curated tokens, search/sort/filter, grid or list view
- **Token detail** — price chart, market stats, creator tools (fee burn/claim), community takeover, activity/holders/chat tabs, buy/sell trade panel
- **Launch** — 4-step wizard (details → liquidity & fees → review → deploy)
- **Portfolio** — wallet-gated holdings and tokens you've launched
- **Analytics** — platform-wide stats, launch volume, stack split, top gainers/losers
- **Legal** — terms & privacy

All wallet/chain interactions are simulated client-side; there is no backend or on-chain integration.
