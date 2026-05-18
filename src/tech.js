
window.initTech = async function() {
  try {
  const raw = await DataLoader.loadData('data/tech-data.js', '__TECH_DATA__');
  raw.forEach(function(t){
    t.tags = Array.isArray(t.tags) ? t.tags : [];
    t.badges = Array.isArray(t.badges) ? t.badges : [];
    t.platforms = Array.isArray(t.platforms) ? t.platforms : [];
    t.target_user = Array.isArray(t.target_user) ? t.target_user : [];
  });

  const CATEGORIES = [{"id":"all","label":"All Technologies","icon":"🌐"},{"id":"programming_languages","label":"Programming Languages","icon":"📝"},{"id":"runtimes_edge_wasm","label":"Runtimes, Edge & WebAssembly","icon":"🌍"},{"id":"js_ts_packages","label":"JavaScript & TypeScript Packages","icon":"📦"},{"id":"python_packages","label":"Python Packages","icon":"🐍"},{"id":"frontend_ui","label":"Frontend Frameworks & UI","icon":"🎨"},{"id":"fullstack_web","label":"Full-Stack Web Frameworks","icon":"🔄"},{"id":"backend_servers","label":"Backend Frameworks & Servers","icon":"⚙️"},{"id":"mobile_desktop","label":"Mobile & Desktop Development","icon":"📱"},{"id":"databases_storage_search","label":"Databases, Storage & Search","icon":"🗄️"},{"id":"ai_ml_data_science","label":"AI, ML & Data Science","icon":"🤖"},{"id":"data_eng_analytics","label":"Data Engineering & Analytics","icon":"📊"},{"id":"apis_sdks_dev_platforms","label":"APIs, SDKs & Developer Platforms","icon":"🔌"},{"id":"cloud_hosting","label":"Cloud Platforms & Hosting","icon":"☁️"},{"id":"devops_infra","label":"DevOps, Containers & Infrastructure","icon":"🐳"},{"id":"build_package_release","label":"Build, Package & Release Tools","icon":"📦"},{"id":"testing_qa","label":"Testing & Quality Assurance","icon":"🧪"},{"id":"monitoring_observability","label":"Monitoring & Observability","icon":"📈"},{"id":"security_auth_identity","label":"Security, Auth & Identity","icon":"🔐"},{"id":"messaging_queues_workflows","label":"Messaging, Queues & Workflows","icon":"📬"},{"id":"cms_wordpress_commerce","label":"CMS, WordPress & Commerce","icon":"🟦"},{"id":"browser_ide_extensions","label":"Browser & IDE Extensions","icon":"🧩"},{"id":"design_figma_creative","label":"Design, Figma & Creative Tools","icon":"🎨"},{"id":"docs_knowledge_collab","label":"Docs, Knowledge & Collaboration","icon":"📚"},{"id":"payments_billing","label":"Payments & Billing","icon":"💳"},{"id":"blockchain_web3_crypto","label":"Blockchain, Web3 & Crypto","icon":"⛓️"},{"id":"iot_embedded_hardware","label":"IoT, Embedded & Hardware","icon":"🔌"},{"id":"game_development","label":"Game Development","icon":"🎮"},{"id":"lowcode_nocode_baas","label":"Low-Code, No-Code & BaaS","icon":"🧱"},{"id":"self_hosted_open_source","label":"Self-Hosted & Open-Source Tools","icon":"🏠"}];

  let activeTab = 'all';
  let activeGroup = 'all';
  let searchQuery = '';
  let categoryQuery = '';
  let sortMode = 'recommended';
  let advancedOpen = false;
  let advFilters = {type:'all', ecosystem:'all', platform:'all', open_source:'all', use_case:'all'};

  const els = {
    tabs: document.getElementById('tech-tabs'),
    content: document.getElementById('tech-content'),
    totalCount: document.getElementById('tech-totalCount'),
    categorySearch: document.getElementById('tech-categorySearch'),
    categorySummary: document.getElementById('tech-categorySummary'),
  };

  const tc = document.getElementById('tech-totalCount'); if(tc) tc.textContent = raw.length;

  function scrollSectionTop(){ const sec = document.getElementById('tech-section'); if (sec) sec.scrollTo({top: 0, behavior: 'smooth'}); }
  function escapeHtml(value){ return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function normalize(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' '); }
  function categoryLabel(id){ return (CATEGORIES.find(c=>c.id===id)||{}).label || id; }
  function categoryIcon(id){ return (CATEGORIES.find(c=>c.id===id)||{}).icon || '•'; }

  function getBaseItems(){ return raw.filter(t => activeTab === 'all' || t.category === activeTab); }
  function getGroup(t){ return t.group || t.sub || categoryLabel(t.category) || 'General'; }
  function getGroups(items){
    if(activeTab === 'all') return [];
    const counts = new Map();
    items.forEach(t => { const g=getGroup(t); if(g) counts.set(g,(counts.get(g)||0)+1); });
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  }
  function uniqueValues(items, getter, limit){
    const counts = new Map();
    items.forEach(item => (getter(item)||[]).forEach(v => { if(v) counts.set(v,(counts.get(v)||0)+1); }));
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit||14).map(x=>x[0]);
  }
  function passAdvanced(t){
    if(advFilters.type !== 'all' && t.tech_type !== advFilters.type) return false;
    if(advFilters.ecosystem !== 'all' && t.package_manager !== advFilters.ecosystem) return false;
    if(advFilters.platform !== 'all' && !(t.platforms||[]).includes(advFilters.platform)) return false;
    if(advFilters.open_source === 'yes' && t.open_source !== true) return false;
    if(advFilters.open_source === 'no' && t.open_source === true) return false;
    if(advFilters.use_case !== 'all') {
      const hay = [t.category_label, t.group, t.sub, (t.tags||[]).join(' '), (t.badges||[]).join(' ')].join(' ').toLowerCase();
      if(!hay.includes(String(advFilters.use_case).toLowerCase())) return false;
    }
    return true;
  }

  function matches(t){
    if(activeTab !== 'all' && t.category !== activeTab) return false;
    if(activeGroup !== 'all' && getGroup(t) !== activeGroup) return false;
    if(!passAdvanced(t)) return false;
    if(searchQuery){
      const words = normalize(searchQuery).split(/\s+/).filter(Boolean);
      if(words.length){
        const hay = normalize([t.name,t.desc,t.description,t.sub,t.group,t.category_label,(t.tags||[]).join(' '),(t.badges||[]).join(' '),t.package_name,t.github].join(' '));
        if(!words.every(w => hay.includes(w))) return false;
      }
    }
    return true;
  }

  function sortItems(items){
    return items.sort(function(a,b){
      if(sortMode === 'az') return (a.name||'').localeCompare(b.name||'');
      if(sortMode === 'popular') return (Number(b.popularity_score)||0) - (Number(a.popularity_score)||0) || (a.name||'').localeCompare(b.name||'');
      if(sortMode === 'verified') return String(b.last_verified||'').localeCompare(String(a.last_verified||'')) || (a.name||'').localeCompare(b.name||'');
      return (Number(b.final_rank_score)||0) - (Number(a.final_rank_score)||0) || (a.name||'').localeCompare(b.name||'');
    });
  }

  function renderTabs(){
    const counts = {};
    raw.forEach(t => { counts[t.category] = (counts[t.category]||0)+1; counts.all = (counts.all||0)+1; });
    const q = normalize(categoryQuery || '');
    const available = CATEGORIES.filter(c => c.id === 'all' || (counts[c.id]||0) > 0);
    const visible = available.filter(c => !q || normalize(c.label || '').includes(q) || String(counts[c.id] || 0).includes(q));
    if(els.categorySummary){
      const totalCats = available.filter(c=>c.id!=='all').length;
      const shownCats = visible.filter(c=>c.id!=='all').length;
      els.categorySummary.innerHTML = '<span>'+shownCats+' of '+totalCats+' categories</span><span>'+raw.length.toLocaleString()+' techs</span>';
    }
    if(!visible.length){ els.tabs.innerHTML = '<div class="category-empty">No matching categories.</div>'; return; }
    els.tabs.innerHTML = visible.map(c => `<button class="tab-btn${activeTab===c.id?' active':''}" data-cat="${escapeHtml(c.id)}" title="${escapeHtml(c.label)}"><span class="tab-btn-label"><span class="tab-icon">${escapeHtml(c.icon)} </span>${escapeHtml(c.label)}</span><span class="tab-count">${counts[c.id]||0}</span></button>`).join('');
  }

  function renderControls(baseItems){
    const groups = getGroups(baseItems);
    const hasGroups = activeTab !== 'all' && groups.length > 1;
    const types = uniqueValues(baseItems, t => [t.tech_type], 12);
    const ecosystems = uniqueValues(baseItems, t => [t.package_manager].filter(v => v && !/^none$/i.test(v)), 12);
    const platforms = uniqueValues(baseItems, t => (t.platforms||[]).filter(p => !/^github$/i.test(p)), 12);
    const useCases = uniqueValues(baseItems, t => [t.group, ...(t.badges||[])], 12);
    const groupHtml = hasGroups ? `<div class="filter-row group-filter-row" aria-label="Groups"><button class="group-chip ${activeGroup==='all'?'active':''}" data-group="all" type="button">All groups</button>${groups.map(([g,count])=>`<button class="group-chip ${activeGroup===g?'active':''}" data-group="${escapeHtml(g)}" type="button">${escapeHtml(g)} <span>${count}</span></button>`).join('')}</div>` : '';
    return `<div class="category-filter-panel"><div class="filter-main-row"><div class="filter-title-block"><span class="filter-kicker">Browse</span><strong>${escapeHtml(activeTab==='all'?'All Technologies':categoryLabel(activeTab))}</strong></div><label class="compact-select-label">Sort<select class="compact-select" data-control="sort"><option value="recommended" ${sortMode==='recommended'?'selected':''}>Recommended</option><option value="popular" ${sortMode==='popular'?'selected':''}>Popular</option><option value="verified" ${sortMode==='verified'?'selected':''}>Recently verified</option><option value="az" ${sortMode==='az'?'selected':''}>A-Z</option></select></label><button class="more-filters-toggle" type="button" aria-expanded="${advancedOpen?'true':'false'}">More filters</button></div>${groupHtml}<div class="advanced-filter-panel ${advancedOpen?'active':''}"><label>Type<select data-filter="type"><option value="all">All</option>${types.map(v=>`<option value="${escapeHtml(v)}" ${advFilters.type===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label><label>Ecosystem<select data-filter="ecosystem"><option value="all">All</option>${ecosystems.map(v=>`<option value="${escapeHtml(v)}" ${advFilters.ecosystem===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label><label>Platform<select data-filter="platform"><option value="all">All</option>${platforms.map(v=>`<option value="${escapeHtml(v)}" ${advFilters.platform===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label><label>Open source<select data-filter="open_source"><option value="all">All</option><option value="yes" ${advFilters.open_source==='yes'?'selected':''}>Yes</option><option value="no" ${advFilters.open_source==='no'?'selected':''}>No</option></select></label><label>Use case<select data-filter="use_case"><option value="all">All</option>${useCases.map(v=>`<option value="${escapeHtml(v)}" ${advFilters.use_case===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label><button class="filter-clear-btn" type="button">Clear filters</button></div></div>`;
  }

  function techDisplayTags(t){
    const candidates = [...(t.tags||[]), ...(t.badges||[])];
    const seen = new Set();
    return candidates.filter(x => { const k=String(x||'').toLowerCase(); if(!k||k==='unknown'||seen.has(k)) return false; seen.add(k); return true; }).slice(0,6);
  }

  function buildCard(t){
    const displayTags = techDisplayTags(t);
    const tagHtml = displayTags.map(tag => {
      const cls = /open source/i.test(tag)?'tag-oss':'tag-lang';
      return `<span class="tag ${cls}">${escapeHtml(tag)}</span>`;
    }).join('');
    const links = [];
    if(t.url) links.push(`<a class="card-link" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">🌐 Website</a>`);
    if(t.github) links.push(`<a class="card-link" href="https://github.com/${escapeHtml(t.github)}" target="_blank" rel="noopener">GitHub${t.stars?` <span class="card-stars">⭐ ${escapeHtml(t.stars)}</span>`:''}</a>`);
    return `<article class="tech-card" id="tc-${escapeHtml(t.id)}" data-id="${escapeHtml(t.id)}"><div class="card-top"><div class="card-icon">${escapeHtml(t.icon || '•')}</div><div class="card-identity"><a class="card-name" href="${escapeHtml(t.url||'#')}" target="_blank" rel="noopener">${escapeHtml(t.name)}</a><span class="card-sub">${escapeHtml(t.sub || t.tech_type || '')}</span></div></div><p class="card-desc">${escapeHtml(t.desc || t.description || '')}</p><div class="card-tags">${tagHtml}</div>${links.length ? `<div class="card-links">${links.join('')}</div>` : ''}</article>`;
  }

  function noResults(){ return `<div class="no-results"><strong>No results found</strong><span>Try a different search term, group, or category.</span></div>`; }

  function render(){
    const baseItems = getBaseItems();
    const filtered = sortItems(raw.filter(matches));
    const controlsHtml = renderControls(baseItems);
    const isFiltered = filtered.length !== raw.length;
    if (window.hubSetResultChip) {
      const sec = document.getElementById('tech-section');
      if (sec && sec.classList.contains('active')) window.hubSetResultChip(isFiltered ? `${filtered.length} of ${raw.length} techs` : `${raw.length} technologies`);
    }
    if(filtered.length === 0){ els.content.innerHTML = controlsHtml + noResults(); return; }
    if(activeTab === 'all' && !searchQuery && activeGroup === 'all' && Object.values(advFilters).every(v=>v==='all')){
      const grouped = {}; CATEGORIES.filter(c=>c.id!=='all').forEach(c=>{ grouped[c.id]=[]; });
      filtered.forEach(t=>{ if(grouped[t.category]) grouped[t.category].push(t); });
      let html = controlsHtml;
      CATEGORIES.filter(c=>c.id!=='all').forEach(c=>{ const items=grouped[c.id]; if(!items||!items.length) return; html += `<div class="section-meta"><h2 class="section-title">${escapeHtml(c.icon)} ${escapeHtml(c.label)}</h2><span class="section-count">${items.length}</span></div><div class="tech-grid">${items.slice(0,80).map(buildCard).join('')}</div>`; });
      els.content.innerHTML = html;
    } else {
      els.content.innerHTML = controlsHtml + `<div class="tech-grid">${filtered.map(buildCard).join('')}</div>`;
    }
  }

  function renderAll(){ renderTabs(); render(); }

  els.tabs.addEventListener('click', e=>{ const btn=e.target.closest('.tab-btn'); if(!btn) return; activeTab=btn.dataset.cat; activeGroup='all'; renderAll(); scrollSectionTop(); });
  els.content.addEventListener('click', e=>{
    const groupBtn = e.target.closest('.group-chip');
    if(groupBtn){ activeGroup = groupBtn.dataset.group || 'all'; render(); return; }
    if(e.target.closest('.more-filters-toggle')){ advancedOpen = !advancedOpen; render(); return; }
    if(e.target.closest('.filter-clear-btn')){ advFilters={type:'all', ecosystem:'all', platform:'all', open_source:'all', use_case:'all'}; activeGroup='all'; sortMode='recommended'; render(); return; }
  });
  els.content.addEventListener('change', e=>{
    const sort = e.target.closest('[data-control="sort"]'); if(sort){ sortMode=sort.value||'recommended'; render(); return; }
    const filter = e.target.closest('[data-filter]'); if(filter){ advFilters[filter.dataset.filter]=filter.value||'all'; render(); return; }
  });
  if(els.categorySearch) els.categorySearch.addEventListener('input', function(){ categoryQuery = els.categorySearch.value || ''; renderTabs(); });
  const btt = document.getElementById('tech-backToTop');
  const techSectionEl = document.getElementById('tech-section');
  if (btt && techSectionEl) { techSectionEl.addEventListener('scroll', () => { btt.classList.toggle('visible', techSectionEl.scrollTop > 400); }, {passive: true}); btt.addEventListener('click', scrollSectionTop); }

  renderAll();

  window.addEventListener('hub-message', function(e){
    const msg = e.detail; if(!msg||!msg.type) return;
    if(msg.type==='refreshChip'){ const sec=document.getElementById('tech-section'); if(sec&&sec.classList.contains('active')) render(); return; }
    if(msg.type==='search'){ const next=(msg.query||'').trim(); if(next===searchQuery) return; searchQuery=next; render(); return; }
    if(msg.type==='selectCategory'){ var btn=els.tabs.querySelector('.tab-btn[data-cat="'+msg.id+'"]'); if(btn){ btn.click(); scrollSectionTop(); } }
    if(msg.type==='scrollToItem'){
      const target = raw.find(t => t.id === msg.id);
      const targetCategory = msg.category || (target && target.category);
      if(targetCategory && targetCategory!==activeTab){ activeTab = targetCategory; activeGroup='all'; renderAll(); }
      else if(activeTab === 'all' && targetCategory){ activeTab = targetCategory; activeGroup='all'; renderAll(); }
      requestAnimationFrame(function(){ var el=document.getElementById('tc-'+msg.id); if(el){ el.scrollIntoView({behavior:'smooth',block:'center'}); el.style.outline='2px solid #6366f1'; el.style.borderRadius='16px'; setTimeout(function(){ el.style.outline=''; },2000); } });
    }
  });

  } catch(e) { console.error('TECH INIT ERROR:', e); }
};

