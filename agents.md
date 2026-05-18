# Master Dev Hub — Agent Context

## Overview
High-performance, production-grade, decomposed developer catalog featuring **1,524 AI Tools** and **1,767 Developer Stacks**. Decomposed from a monolithic 7.11 MB HTML file into a dynamic **Vite + Vanilla JS** application.

## Stack
- **Bundler**: Vite 8+
- **Language**: Vanilla JS (ES Modules)
- **Styling**: Vanilla CSS (CSS Grid, Flexbox, CSS Variables)
- **Data Loading**: Lazy, asynchronous load via dynamic script tag injection (`DataLoader`) from `/public/data/`.

## Key Dirs & Files
```
master-dev-hub/
├── public/
│   ├── data/
│   │   ├── tools-data.js     ← 1,524 AI Tools database
│   │   ├── tech-data.js      ← 1,767 Developer Stacks database
│   │   └── search-index.js   ← Autocomplete search index
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── styles/
│   │   ├── hub-shell.css     ← Global brand, navigation, autocomplete triggers
│   │   └── tools-tech.css    ← View grids, category sidebar, comparison drawer, modal panels
│   ├── dataLoader.js         ← Asynchronous script loading controller
│   ├── main.js               ← Main router, global search, and tab orchestration
│   ├── tools.js              ← AI Tools directory controller and grid builder
│   └── tech.js               ← Tech Stack directory controller and grid builder
├── index.html                ← Single SPA shell node mounts
├── vite.config.js            ← Production build assets compiler config
└── README.md                 ← Technical gains, structure, and operations documentation
```

## How to Run / Build / Test
```bash
# Run local development server
npm.cmd run dev

# Compile production bundles
npm.cmd run build
```

## Env Vars Needed
None. Fully client-side SPA.

## Agent-Specific Notes

### Layout & Scrolling Gotchas (Critical)
- **Html/Body Constraints**: `html` and `body` must maintain `height: 100%; min-height: 100%;` to resolve page shell layout percentages.
- **Scroll Container**: `#tools-section` and `#tech-section` act as the viewport scroll containers.
- **Group Clipping Warning**: **Never** apply `content-visibility: auto` or `contain-intrinsic-size` to `.group-block` elements. It causes browser scroll containers to miscalculate heights, breaking smooth scrollbars and clipping elements.
- **Page Bottom Spacing**: Keep `.page-shell` bottom padding at `80px` to give lists breathing room and clear any floating UI components (like the comparison drawer or back-to-top button).

### Grid Columns Layout (Critical)
- Under `@media(min-width: 1200px)`, the `.tool-grid` columns **must** be styled as `repeat(4, minmax(0, 1fr))`. 
- **Never** use `repeat(4, minmax(320px, 1fr))` as it forces the grid to overflow the available workspace container when the sidebar is present on 1200px-1600px screens, causing the 4th column card (WooCommerce) to be half-hidden.

### Favicon & Logos Loading Fallback (Critical)
- **Google Favicon API Integration**: Google s2 API is appended with `&default=404` parameter. This triggers a `404` HTTP status if no custom favicon exists, instead of returning an ugly generic globe image.
- **Premium CSS Letter Avatars**: `src/main.js` registers a global capturing `'error'` event listener. When both Google s2 and DuckDuckGo favicon APIs fail (or are blocked offline), it instantly replaces the broken `<img>` element with a beautiful, color-harmonized, gradient-based `<div>` letter avatar derived repeatably from the tool's name.
