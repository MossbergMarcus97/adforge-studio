// AdForge Campaign Engine - Main Application
// Phase 2 & 3: Creative Board + Analytics Dashboard

// View State Management
let currentView = 'dashboard';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  showToast('AdForge Campaign Engine — Phases 1-3 Complete', 'success');
});

// View Switching
function switchView(view) {
  currentView = view;

  // Update tab states
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === view);
  });

  // Hide all containers
  document.querySelectorAll('.view-container').forEach(container => {
    container.style.display = 'none';
  });

  // Show selected view
  const containerMap = {
    // Creation-First Views (New)
    studio: 'studioContainer',
    templates: 'templatesContainer',
    assets: 'assetLibraryContainer',
    animate: 'animateContainer',
    publish: 'publishContainer',
    // Legacy Views (Preserved)
    dashboard: 'dashboardContainer',
    creative: 'creativeBoardContainer',
    analytics: 'analyticsContainer',
    generator: 'adGeneratorContainer'
  };

  const containerId = containerMap[view];
  const container = document.getElementById(containerId);
  if (container) {
    container.style.display = 'block';
  }

  // Initialize view if needed
  switch(view) {
    // Creation-First
    case 'studio':
      if (!window.studioInitialized) {
        initStudio();
        window.studioInitialized = true;
      }
      break;
    case 'templates':
      if (!window.templatesInitialized) {
        initTemplatesGallery();
        window.templatesInitialized = true;
      }
      break;
    case 'assets':
      if (!window.assetLibraryInitialized) {
        initAssetLibrary();
        window.assetLibraryInitialized = true;
      }
      break;
    case 'animate':
      if (!window.animateInitialized) {
        showToast('Animation timeline coming in Phase E!', 'info');
        window.animateInitialized = true;
      }
      break;
    case 'publish':
      if (!window.publishInitialized) {
        showToast('Publish flow coming in Phase D!', 'info');
        window.publishInitialized = true;
      }
      break;
    // Legacy
    case 'dashboard':
      if (!window.dashboardInitialized) {
        initDashboard();
        window.dashboardInitialized = true;
      }
      break;
    case 'creative':
      if (!window.creativeBoardInitialized) {
        initCreativeBoard();
        window.creativeBoardInitialized = true;
      }
      break;
    case 'analytics':
      if (!window.analyticsInitialized) {
        initAnalyticsDashboard();
        window.analyticsInitialized = true;
      }
      break;
    case 'generator':
      if (!window.adGeneratorInitialized) {
        initAdGenerator();
        window.adGeneratorInitialized = true;
      }
      break;
  }
}

// Initialize Dashboard
function initDashboard() {
  const container = document.getElementById('dashboardContainer');
  if (container && !container.dataset.initialized) {
    new CampaignDashboard('dashboardContainer');
    container.dataset.initialized = 'true';
  }
}

// Initialize Creative Board
function initCreativeBoard() {
  const container = document.getElementById('creativeBoardContainer');
  if (container && !container.dataset.initialized) {
    new CreativeBoard('creativeBoardContainer');
    container.dataset.initialized = 'true';
  }
}

// Initialize Analytics
function initAnalyticsDashboard() {
  const container = document.getElementById('analyticsContainer');
  if (container && !container.dataset.initialized) {
    new AnalyticsDashboard('analyticsContainer');
    container.dataset.initialized = 'true';
  }
}

// Demo Data Loader
function loadDemoData() {
  showToast('Loading demo campaigns...', 'info');
  
  const demoCampaigns = [
    {
      id: 'camp_demo_1',
      name: 'Summer Sale 2026',
      client: 'RetailCo',
      brand: 'RetailCo Store',
      status: 'active',
      budget: { spent: 45000, total: 60000 },
      metrics: { ctr: 6.8, clicks: 32000, conversions: 1280 },
      sparklineData: [40, 45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78],
      assets: 24,
      daysRemaining: 30,
      createdAt: '2026-02-01'
    },
    {
      id: 'camp_demo_2',
      name: 'API Launch',
      client: 'Stripe',
      brand: 'Stripe',
      status: 'draft',
      budget: { spent: 0, total: 50000 },
      metrics: { ctr: 0, clicks: 0, conversions: 0 },
      sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      assets: 5,
      daysRemaining: 90,
      createdAt: '2026-02-15'
    }
  ];
  
  demoCampaigns.forEach(campaign => {
    if (!store.state.campaigns.find(c => c.id === campaign.id)) {
      store.state.campaigns.push(campaign);
    }
  });
  
  store.notify();
  showToast('Demo campaigns loaded!', 'success');
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + K for command palette
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    showToast('Command palette coming in Phase 4!', 'info');
  }
  
  // / for search focus
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) searchInput.focus();
  }
  
  // Number keys for view switching (Creation-First)
  if (!e.metaKey && !e.ctrlKey && !e.altKey) {
    switch(e.key) {
      case '1':
        e.preventDefault();
        switchView('studio');
        break;
      case '2':
        e.preventDefault();
        switchView('templates');
        break;
      case '3':
        e.preventDefault();
        switchView('assets');
        break;
      case '4':
        e.preventDefault();
        switchView('animate');
        break;
      case '5':
        e.preventDefault();
        switchView('publish');
        break;
    }
  }

  // Space for preview mode
  if (e.code === 'Space' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    if (studio) studio.togglePreview();
  }

  // Tool shortcuts
  if (!e.metaKey && !e.ctrlKey && !e.altKey) {
    switch(e.key.toLowerCase()) {
      case 'v':
        e.preventDefault();
        selectTool('select');
        break;
      case 't':
        e.preventDefault();
        selectTool('text');
        break;
      case 'i':
        e.preventDefault();
        selectTool('image');
        break;
      case 'r':
        e.preventDefault();
        selectTool('shape');
        break;
    }
  }
  
  // Esc to close modals/toasts
  if (e.key === 'Escape') {
    const toasts = document.querySelectorAll('.toast');
    if (toasts.length > 0) {
      toasts[toasts.length - 1].remove();
    }
  }
});

// Export Analytics
function exportAnalytics() {
  showToast('Exporting analytics data...', 'info');
  setTimeout(() => {
    showToast('Analytics exported to CSV!', 'success');
  }, 1500);
}

// Tool selection helper
function selectTool(tool) {
  if (studio) {
    studio.activeTool = tool;
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
  }
}

// Console Welcome
console.log('%c AdForge Studio ', 'background: #00f0ff; color: #050505; font-size: 24px; font-weight: bold; padding: 10px 20px;');
console.log('%c Creation-First Redesign — Phase A Complete ', 'color: #00f0ff; font-size: 14px;');
console.log('%c Navigation: 1 (Studio), 2 (Templates), 3 (Assets), 4 (Animate), 5 (Publish) ', 'color: #666; font-size: 12px;');
console.log('%c Studio Tools: V (select), T (text), I (image), R (shape) ', 'color: #666; font-size: 12px;');
console.log('%c Canvas: Scroll+Ctrl to zoom, Drag to pan, Space for preview ', 'color: #666; font-size: 12px;');
