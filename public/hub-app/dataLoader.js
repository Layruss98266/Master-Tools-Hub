
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
      // Served from Next.js /public — data files live at the site root (/data/...).
      const base = '/';
      script.src = /^([a-z]+:)?\/\//i.test(scriptUrl) || scriptUrl.startsWith('/')
        ? scriptUrl
        : base + scriptUrl.replace(/^\.?\//, '');
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

