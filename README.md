# ⚡ Master Dev Hub

A premium, high-performance developer catalog featuring **1,524 AI Tools** and **1,767 Developer Technologies**. Optimized from a monolithic 7.11 MB HTML file into a dynamic, lazy-loaded **Vite + Vanilla JS** SPA.

## 📁 Repository Structure
```
master-dev-hub/
├── public/
│   ├── data/                       # Asynchronously lazy-loaded datasets
│   │   ├── tools-data.js           # 1,524 AI Tools database
│   │   ├── tech-data.js            # 1,767 Developer Tech database
│   │   └── search-index.js         # Global search index
│   ├── favicon.svg                 # Brand icon
│   └── icons.svg                   # Global vector icon library
├── src/
│   ├── styles/                     # Modularized Vanilla CSS styles
│   │   ├── hub-shell.css           # Header, layout, autocomplete search
│   │   ├── tools-tech.css          # Cards, categories sidebar, modals, drawers
│   │   └── main.css                # Style entry aggregator
│   ├── dataLoader.js               # Dynamic script injection and caching manager
│   ├── tools.js                    # AI Tools tab controller and favorites logic
│   ├── tech.js                     # Tech Stack tab controller and filtering logic
│   └── main.js                     # SPA tab router and global search orchestrator
├── index.html                      # DOM nodes entrypoint mount
├── vite.config.js                  # Production bundler relative paths config
└── agents.md                       # Layout constraints and visual developer gotchas
```

## 🚀 Getting Started

### Installation
```bash
git clone https://github.com/Surya8991/Master-Tools-Hub.git
cd master-dev-hub
npm install
```

### Local Development
```bash
npm run dev
```
Runs the server locally at `http://localhost:5173/` with hot module reloading.

### Production Build
```bash
npm run build
```
Compiles and bundles minimized assets into the `/dist` directory. The built assets are ready for static hosting deployment (Vercel, GitHub Pages, Netlify).

## ⚡ Core Features
- **Bi-Tabular Dashboard**: Instant client-side switching between **AI Tools** and **Tech Stack** directories.
- **Fuzzy Global Search**: pre-compiled synonym-expanded edit distance fuzzy matching with full keyboard arrow + enter navigation.
- **Responsive density settings**: Choose between **S** (Compact), **M** (Default), or **L** (Comfortable) density views to adjust screen card details.
- **Comparison matrix**: Side-by-side matrices comparing selected tools on pricing, tags, and description.
- **Interactive slide-out drawer**: Slick, responsive side panel inspecting exhaustive details (integrations, features, similar tools).
- **Favicons fallback**: Integrated Google s2 API (`default=404`) and DuckDuckGo API with a custom global listener generating color-harmonized CSS gradient avatars repeatably derived from tool names if offline or blocked.
