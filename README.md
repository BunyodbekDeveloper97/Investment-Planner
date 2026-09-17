# Investment Planner

> A mobile-first React investment planning workspace for modeling long-term growth, testing assumptions, tracking goals, and keeping reusable scenarios.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat-square&logo=vite&logoColor=fff)

## Product

Investment Planner started as a simple React compound-interest exercise and was redesigned as a small product-style planning workspace.

It helps users answer questions such as:

- What could a consistent contribution plan build over a chosen horizon?
- How sensitive is the result to different return assumptions?
- How much of the final value comes from contributions versus modeled growth?
- What does inflation do to purchasing power?
- How much could fees reduce the projected balance?
- What contribution amount would mathematically reach a chosen target under the same model?

This is an educational planning tool. It does not provide financial advice or guarantee investment returns.

## Mobile-first UX

The primary experience is designed around phone usage. The layout starts from a 320px mobile baseline and progressively enhances for tablets and desktop.

- Thumb-friendly controls with 44–48px touch targets
- Sticky bottom navigation for Plan, Results, Goal, and Saved scenarios
- Single-column investment form on phones
- Horizontal goal template chips optimized for touch scrolling
- Charts scale to the viewport without forced horizontal scrolling
- Year-by-year results become expandable cards on mobile
- Safe-area support for iPhone home-indicator devices
- Responsive typography, spacing, and action buttons
- Reduced-motion support for accessibility

## Features

### Planning
- Initial investment and recurring contributions
- Monthly or annual contribution frequency
- Expected annual return assumption
- Investment horizon up to 100 years
- Annual fee modeling
- Inflation-adjusted value
- Currency display: USD, KRW, EUR, GBP, UZS
- Goal presets and custom goal names

### Analysis
- Projected final value
- Total invested
- Modeled growth
- Inflation-adjusted purchasing power
- Fees paid over the modeled horizon
- Interactive SVG growth chart
- Nominal vs inflation-adjusted comparison
- Portfolio composition view
- Conservative / base / higher-return sensitivity scenarios
- Suggested contribution required to reach the goal
- Year-by-year breakdown table

### Product UX
- Responsive desktop/tablet/mobile layout
- Dark / light theme persisted locally
- Saved scenarios with load/delete actions
- Shareable plan URLs
- CSV export
- Browser print-to-PDF report workflow
- Keyboard-friendly controls
- Accessible labels and error states
- No `NaN` output for invalid numeric inputs

### Engineering
- Calculation engine isolated from UI
- Deterministic automated tests
- ESLint configuration
- Prettier configuration
- GitHub Actions CI
- Vercel SPA configuration
- Dependency-light SVG chart implementation

## Calculation model

The version 1 model makes the following explicit assumptions:

1. Recurring contributions are added at the end of each contribution period.
2. The annual return assumption is divided evenly across the selected number of periods.
3. Fees are applied after each period's modeled growth.
4. Inflation adjusts reported value for purchasing power; it does not change nominal portfolio growth.
5. Results are mathematical estimates based on the assumptions entered by the user.

The calculation engine is in:

```text
src/features/calculator/calculator.engine.js
```

## Tech stack

- React 19
- Vite
- JavaScript (ES modules)
- CSS
- Browser Web APIs: localStorage, Clipboard API, URL, Print
- ESLint
- Vercel-ready React/Vite deployment

> JavaScript is intentional in this repository so the project stays aligned with the React course it evolved from. The feature-based architecture and pure calculation engine make a future TypeScript migration straightforward.

## Architecture

```text
src/
├── components/
│   ├── AppFooter.jsx
│   ├── Header.jsx
│   ├── ScenarioManager.jsx
│   └── Toast.jsx
├── features/
│   ├── calculator/
│   │   ├── Breakdown.jsx
│   │   ├── CompositionCard.jsx
│   │   ├── GrowthChart.jsx
│   │   ├── InvestmentForm.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── calculator.engine.js
│   │   └── calculator.presets.js
│   ├── goals/
│   │   └── GoalProgress.jsx
│   └── scenarios/
│       └── ScenarioPanel.jsx
├── lib/
│   ├── export.js
│   ├── formatters.js
│   └── storage.js
├── App.jsx
├── index.css
└── index.jsx
```


## Getting started

### Requirements

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build and lint

```bash
npm run lint
npm run build
```

## Deployment

Vercel supports Vite/React projects and can detect the framework automatically. This project does not need a custom `vercel.json` because the current app is a single-page Vite application.

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
Install command: npm ci
Root Directory: ./
```

### Deploy to Vercel

1. Push the repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the GitHub repository.
3. Keep the project root as `./`. Vercel should detect Vite/React automatically.
4. Use `npm run build` as the build command and `dist` as the output directory.
5. Click **Deploy**. Future pushes to the connected GitHub branch can trigger new deployments.

CLI alternative:

```bash
npm install
npm run build
npm install --global vercel
vercel
vercel --prod
```

## GitHub setup

```bash
git init
git add .
git commit -m "feat: build investment planner v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/investment-planner.git
git push -u origin main
```

## Portfolio talking points

When presenting this project, focus on the engineering decisions rather than calling it only a calculator:

- Separated the domain calculation engine from the React UI.
- Added recurring contribution frequency support and fee/inflation modeling.
- Built scenario sensitivity analysis using the same calculation engine.
- Added local persistence, shareable plan URLs, CSV export, and print-ready PDF workflow.
- Added validation and safe handling for invalid numeric inputs.

## Roadmap

### v2 — SaaS direction

- Authentication
- Supabase/PostgreSQL persistence
- Dashboard and portfolio history
- Shareable scenario pages with access controls
- Contribution tracking and milestones
- Notification preferences
- Playwright end-to-end coverage
- TypeScript migration

## License

MIT
