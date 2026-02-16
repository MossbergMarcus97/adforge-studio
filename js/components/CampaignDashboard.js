// Campaign Dashboard - Main View
class CampaignDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => this.update());
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Campaign Dashboard</h1>
        <button class="btn btn-primary" onclick="showToast('New campaign wizard coming soon!', 'info')">
          + New Campaign
        </button>
      </div>
      
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">Status:</span>
          <select class="filter-select" id="statusFilter">
            <option value="all">All Campaigns</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">Search:</span>
          <input type="text" class="input" id="searchInput" placeholder="Search campaigns..." style="width: 240px; padding: 8px 14px; font-size: 0.875rem;">
        </div>
        
        <div class="filter-group">
          <span class="filter-label">Sort:</span>
          <select class="filter-select" id="sortSelect">
            <option value="recent">Most Recent</option>
            <option value="budget">Budget (High-Low)</option>
            <option value="performance">Performance</option>
          </select>
        </div>
        
        <div class="filter-group" style="margin-left: auto;">
          <span class="filter-label" id="campaignCount">Loading...</span>
        </div>
      </div>
      
      <div class="campaign-grid" id="campaignGrid">
        <!-- Campaigns rendered here -->
      </div>
    `;
    
    this.update();
  }

  update() {
    const campaigns = store.getFilteredCampaigns();
    const grid = this.container.querySelector('#campaignGrid');
    const countLabel = this.container.querySelector('#campaignCount');
    
    countLabel.textContent = `${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''}`;
    
    if (campaigns.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">📊</div>
          <h3>No campaigns found</h3>
          <p>Try adjusting your filters or create a new campaign.</p>
        </div>
      `;
      return;
    }
    
    grid.innerHTML = '';
    campaigns.forEach(campaign => {
      grid.appendChild(createCampaignCard(campaign));
    });
  }

  attachEventListeners() {
    // Status filter
    const statusFilter = this.container.querySelector('#statusFilter');
    statusFilter.addEventListener('change', (e) => {
      store.setFilter(e.target.value);
    });
    
    // Search input
    const searchInput = this.container.querySelector('#searchInput');
    searchInput.addEventListener('input', debounce((e) => {
      store.setSearchQuery(e.target.value);
    }, 300));
    
    // Sort select
    const sortSelect = this.container.querySelector('#sortSelect');
    sortSelect.addEventListener('change', (e) => {
      store.setSortBy(e.target.value);
    });
  }
}

// Utility: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
