# Master Dev Hub — Agent Context

## Overview
High-performance, production-grade, decomposed developer catalog featuring **1,524 AI Tools** and **1,767 Developer Stacks**. Decomposed from a monolithic 7.11 MB HTML file into a dynamic, lazy-loaded **Vite + Vanilla JS** SPA.

## Stack
- **Bundler**: Vite 8+
- **Language**: Vanilla JS (ES Modules)
- **Styling**: Vanilla CSS (CSS Grid, Flexbox, CSS Variables)
- **Data Loading**: Lazy, asynchronous load via dynamic script tag injection (`DataLoader`) from `/public/data/`.

## Key Dirs & Files
```
master-dev-hub/
├── public/
│   ├── data/                       # Asynchronously lazy-loaded datasets
│   │   ├── tools-data.js           # 1,524 AI Tools database (2.9 MB)
│   │   ├── tech-data.js            # 1,767 Developer Tech database (2.7 MB)
│   │   └── search-index.js         # Pre-compiled global search index (1.3 MB)
│   ├── favicon.svg                 # Brand icon
│   └── icons.svg                   # Global vector icon library
├── src/
│   ├── styles/                     # Modularized Vanilla CSS styles
│   │   ├── hub-shell.css           # Global header, layout, global search
│   │   ├── tools-tech.css          # Cards, sidebar tabs, filter matrices, modal popovers
│   │   └── main.css                # Aggregate stylesheet entry point
│   ├── dataLoader.js               # Dynamically loads and caches the public/data/ files
│   ├── tools.js                    # AI Tools tab controller and favorites logic
│   ├── tech.js                     # Tech Stack tab controller and filtering logic
│   └── main.js                     # Main global search, routing, and hotkeys orchestrator
├── index.html                      # Clean structure with structural DOM nodes
├── vite.config.js                  # Custom Vite relative paths build configurations
├── package.json                    # Dev server script commands and dependencies
└── README.md                       # Simplified repository documentation
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

### What to avoid
- **Never edit production files** in `/dist` directly. Always make edits in `/src` or `/public/data` and run `npm run build`.
- **Never use `content-visibility: auto`** or `contain-intrinsic-size` on `.group-block` elements in `tools-tech.css`. It causes browser scroll containers to miscalculate heights, breaking smooth scrollbars and clipping elements.
- **Never use `repeat(4, minmax(320px, 1fr))`** for `.tool-grid` columns under `@media(min-width: 1200px)`. It forces overflow in the 4th column card (WooCommerce) on 1200px-1600px viewports. Always use `repeat(4, minmax(0, 1fr))`.
- **Never use TailwindCSS** or add dynamic Tailwind dependencies unless explicitly requested. Only standard, highly-curated HSL Vanilla CSS is allowed.

### Sensitive areas
- **Favicon URLs Helper** (`src/tools.js` line 314): The s2 API requires `&default=404` to fail cleanly, rather than returning the generic Google globe. Changing or removing this parameter will break the visual quality and trigger mechanisms.
- **Global Error Listener** (`src/main.js` line 8): Captures image errors from both `.tool-favicon` and `.td-sim-favicon` grids to generate premium gradient-based avatars. Changes to this selector logic will cause broken icons to display.

### Known gotchas
- **Capturing Error Handler**: The `'error'` event does not bubble in the DOM. Therefore, the global error listener in `src/main.js` must be registered with **capturing enabled** (`true` as the 3rd parameter) to successfully intercept failed images inside lazy-loaded cards.
- **Layout Height Propagation**: `html` and `body` must maintain `height: 100%; min-height: 100%;` in `tools-tech.css` to allow percentage heights of child scrollbars to resolve properly.
- **CORS Bypass Loader**: Databases are structured as standalone JS scripts loaded via dynamic `<script>` tag injection rather than `fetch` requests. This completely bypasses standard local `file://` scheme CORS blocks during offline or raw testing.
