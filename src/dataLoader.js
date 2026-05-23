
const DataLoader = (function() {
  const cache = {};

  async function loadData(scriptUrl, globalVarName) {
    if (cache[globalVarName]) {
      return cache[globalVarName];
    }
    if (window[globalVarName]) {
      cache[globalVarName] = window[globalVarName];
      return window[globalVarName];
    }
    // Standalone/local fallback: some single-file builds inline data before this loader.
    // If the global appears on the next tick, use it instead of trying a file:// script load.
    await new Promise(r => setTimeout(r, 0));
    if (window[globalVarName]) {
      cache[globalVarName] = window[globalVarName];
      return window[globalVarName];
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // Resolve relative data paths against Vite's configured base so the
      // <script> fallback works under nested-route / sub-path deployments.
      const base = (import.meta.env && import.meta.env.BASE_URL) || '/';
      script.src = /^([a-z]+:)?\/\//i.test(scriptUrl) || scriptUrl.startsWith('/')
        ? scriptUrl
        : base.replace(/\/$/, '/') + scriptUrl.replace(/^\.?\//, '');
      script.onload = () => {
        cache[globalVarName] = window[globalVarName];
        resolve(window[globalVarName]);
      };
      script.onerror = () => {
        console.error(`Failed to load ${scriptUrl}`);
        reject(new Error(`Failed to load ${scriptUrl}`));
      };
      document.head.appendChild(script);
    });
  }

  return { loadData };
})();
window.DataLoader = DataLoader;

