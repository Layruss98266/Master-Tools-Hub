import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE_BASE = 'https://master-dev-hub.com';

// Robustly extract the JSON object/array that a data file assigns to a global,
// e.g. `window.__TOOLS_DATA__ = {...};`. Parses everything after the first `=`
// and strips a single trailing semicolon. Returns null on any failure.
function parseGlobalAssignment(filePath) {
  try {
    const src = readFileSync(filePath, 'utf8');
    const eq = src.indexOf('=');
    if (eq === -1) return null;
    let payload = src.slice(eq + 1).trim();
    payload = payload.replace(/;[\s\r\n]*$/, '').trim();
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

function collectCategoryIds(toolsData, techData) {
  const ids = new Set();
  if (toolsData && Array.isArray(toolsData.categories)) {
    toolsData.categories.forEach(c => { if (c && c.id) ids.add(String(c.id)); });
  }
  if (Array.isArray(techData)) {
    techData.forEach(t => {
      if (t && t.category && t.category !== 'all') ids.add(String(t.category));
    });
  }
  return [...ids];
}

function sitemapPlugin() {
  return {
    name: 'emit-sitemap',
    apply: 'build',
    closeBundle() {
      const root = process.cwd();
      const toolsData = parseGlobalAssignment(resolve(root, 'public/data/tools-data.js'));
      const techData = parseGlobalAssignment(resolve(root, 'public/data/tech-data.js'));
      const catIds = collectCategoryIds(toolsData, techData);

      const lastmod = new Date().toISOString().slice(0, 10);
      const urls = [SITE_BASE + '/'];
      catIds.forEach(id => {
        urls.push(SITE_BASE + '/?cat=' + encodeURIComponent(id));
      });

      const body = urls.map(loc =>
        '  <url>\n' +
        '    <loc>' + loc.replace(/&/g, '&amp;') + '</loc>\n' +
        '    <lastmod>' + lastmod + '</lastmod>\n' +
        '  </url>'
      ).join('\n');

      const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        body + '\n' +
        '</urlset>\n';

      writeFileSync(resolve(root, 'dist/sitemap.xml'), xml, 'utf8');
      console.log('[emit-sitemap] wrote dist/sitemap.xml with ' + urls.length + ' urls');
    }
  };
}

export default defineConfig({
  // Use relative asset paths to support flexible deployments (subfolders, local servers, static CDNs)
  base: './',
  plugins: [sitemapPlugin()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Increase chunk size warning limit due to heavier code bundles if necessary
    chunkSizeWarningLimit: 1000
  }
});
