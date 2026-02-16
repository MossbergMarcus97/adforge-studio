// Asset Library - Centralized Creative Repository
class AssetLibrary {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.assets = this.initMockAssets();
    this.filter = 'all';
    this.searchQuery = '';
    this.selectedAsset = null;
    this.init();
  }

  initMockAssets() {
    return [
      { id: 'asset_001', name: 'Hero_Banner_Q3.png', type: 'image', size: '2.4MB', dimensions: '1200x628', campaign: 'Q3 Enterprise Push', tags: ['hero', 'enterprise', 'blue'], created: '2026-02-10', usage: 4, fatigue: 'low' },
      { id: 'asset_002', name: 'Product_Demo_v2.mp4', type: 'video', size: '18.5MB', duration: '0:30', campaign: 'Brand Awareness Q1', tags: ['video', 'demo', 'product'], created: '2026-02-08', usage: 12, fatigue: 'medium' },
      { id: 'asset_003', name: 'Carousel_Set_A.zip', type: 'carousel', size: '8.2MB', count: 5, campaign: 'Q3 Enterprise Push', tags: ['carousel', 'features'], created: '2026-02-05', usage: 2, fatigue: 'low' },
      { id: 'asset_004', name: 'Logo_Primary.svg', type: 'image', size: '45KB', dimensions: '800x600', campaign: 'Global', tags: ['logo', 'brand', 'svg'], created: '2026-01-15', usage: 24, fatigue: 'none' },
      { id: 'asset_005', name: 'Email_Header_Spring.jpg', type: 'image', size: '1.8MB', dimensions: '600x300', campaign: 'Spring Collection', tags: ['email', 'spring', 'pastel'], created: '2026-02-12', usage: 1, fatigue: 'low' },
      { id: 'asset_006', name: 'Retargeting_Static_v3.png', type: 'image', size: '890KB', dimensions: '1080x1080', campaign: 'Holiday Retargeting', tags: ['retargeting', 'square', 'red'], created: '2025-12-01', usage: 18, fatigue: 'high' },
      { id: 'asset_007', name: 'Brand_Fonts.zip', type: 'fonts', size: '12MB', campaign: 'Global', tags: ['fonts', 'typography', 'brand'], created: '2026-01-20', usage: 8, fatigue: 'none' },
      { id: 'asset_008', name: 'Testimonial_Video_1.mp4', type: 'video', size: '45MB', duration: '1:15', campaign: 'Brand Awareness Q1', tags: ['video', 'testimonial', 'social-proof'], created: '2026-02-01', usage: 6, fatigue: 'low' }
    ];
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="dashboard-header">
        <h2 class="dashboard-title">Asset Library</h2>
        <button class="btn btn-primary" onclick="showToast('Asset upload coming soon!', 'info')">
          + Upload Asset
        </button>
      </div>
      
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">Type:</span>
          <select class="filter-select" id="assetTypeFilter">
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="carousel">Carousels</option>
            <option value="fonts">Fonts</option>
          </select>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">Search:</span>
          <input type="text" class="input" id="assetSearchInput" placeholder="Search assets..." style="width: 240px; padding: 8px 14px; font-size: 0.875rem;">
        </div>
        
        <div class="filter-group" style="margin-left: auto;">
          <span class="filter-label">${this.getFilteredAssets().length} assets</span>
        </div>
      </div>
      
      <div class="asset-grid">
        ${this.getFilteredAssets().map(asset => this.renderAssetCard(asset)).join('')}
      </div>
      
      ${this.selectedAsset ? this.renderAssetDetailPanel() : ''}
    `;
    
    this.attachEventListeners();
  }

  renderAssetCard(asset) {
    const typeIcons = {
      image: '🖼️',
      video: '🎬',
      carousel: '🎠',
      fonts: '🔤'
    };
    
    const fatigueColors = {
      none: 'var(--acid-lime)',
      low: 'var(--acid-lime)',
      medium: 'var(--hot-orange)',
      high: 'var(--neon-magenta)'
    };
    
    return `
      <div class="asset-card ${this.selectedAsset?.id === asset.id ? 'selected' : ''}" data-id="${asset.id}" onclick="selectAsset('${asset.id}')">
        <div class="asset-thumbnail" style="background: linear-gradient(135deg, #1e1e26, #2a2a35);">
          <span style="font-size: 3rem; opacity: 0.6;">${typeIcons[asset.type] || '📄'}</span>
          ${asset.type === 'video' ? '<span class="video-badge">▶</span>' : ''}
        </div>
        <div class="asset-info">
          <h4 class="asset-name">${asset.name}</h4>
          <div class="asset-meta-row">
            <span class="asset-type">${asset.type}</span>
            <span class="asset-size">${asset.size}</span>
          </div>
          <div class="asset-tags">
            ${asset.tags.slice(0, 2).map(tag => `<span class="asset-tag">${tag}</span>`).join('')}
          </div>
          <div class="asset-usage-bar">
            <div class="usage-label">
              <span>Usage</span>
              <span style="color: ${fatigueColors[asset.fatigue]};">${asset.usage} campaigns</span>
            </div>
            <div class="usage-progress">
              <div class="usage-fill" style="width: ${Math.min(asset.usage * 5, 100)}%; background: ${fatigueColors[asset.fatigue]};"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAssetDetailPanel() {
    const asset = this.selectedAsset;
    if (!asset) return '';
    
    return `
      <div class="asset-detail-panel">
        <div class="panel-header">
          <h3>${asset.name}</h3>
          <button class="btn btn-ghost" onclick="closeAssetDetail()">✕</button>
        </div>
        <div class="panel-content">
          <div class="asset-preview-large" style="background: linear-gradient(135deg, #1e1e26, #2a2a35); height: 200px; display: grid; place-items: center; border-radius: 12px; margin-bottom: 20px;">
            <span style="font-size: 4rem; opacity: 0.5;">${asset.type === 'image' ? '🖼️' : asset.type === 'video' ? '🎬' : '📄'}</span>
          </div>
          
          <div class="asset-properties">
            <div class="property-row">
              <span class="property-label">Type</span>
              <span class="property-value">${asset.type}</span>
            </div>
            <div class="property-row">
              <span class="property-label">Size</span>
              <span class="property-value">${asset.size}</span>
            </div>
            ${asset.dimensions ? `
            <div class="property-row">
              <span class="property-label">Dimensions</span>
              <span class="property-value">${asset.dimensions}</span>
            </div>` : ''}
            ${asset.duration ? `
            <div class="property-row">
              <span class="property-label">Duration</span>
              <span class="property-value">${asset.duration}</span>
            </div>` : ''}
            <div class="property-row">
              <span class="property-label">Campaign</span>
              <span class="property-value">${asset.campaign}</span>
            </div>
            <div class="property-row">
              <span class="property-label">Created</span>
              <span class="property-value">${asset.created}</span>
            </div>
          </div>
          
          <div class="asset-tags-detail">
            <h4>Tags</h4>
            <div class="tags-list">
              ${asset.tags.map(tag => `<span class="asset-tag">${tag}</span>`).join('')}
            </div>
          </div>
          
          <div class="asset-actions-panel">
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 8px;">Download</button>
            <button class="btn btn-secondary" style="width: 100%; margin-bottom: 8px;">Use in Campaign</button>
            <button class="btn btn-ghost" style="width: 100%; color: var(--neon-magenta);">Delete Asset</button>
          </div>
        </div>
      </div>
    `;
  }

  getFilteredAssets() {
    return this.assets.filter(asset => {
      if (this.filter !== 'all' && asset.type !== this.filter) return false;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return asset.name.toLowerCase().includes(query) ||
               asset.tags.some(tag => tag.toLowerCase().includes(query));
      }
      return true;
    });
  }

  attachEventListeners() {
    const typeFilter = document.getElementById('assetTypeFilter');
    const searchInput = document.getElementById('assetSearchInput');
    
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.filter = e.target.value;
        this.render();
      });
    }
    
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.searchQuery = e.target.value;
        this.render();
      }, 300));
    }
  }
}

// Global instance
let assetLibrary;

function initAssetLibrary() {
  const container = document.getElementById('assetLibraryContainer');
  if (container) {
    assetLibrary = new AssetLibrary('assetLibraryContainer');
  }
}

function selectAsset(assetId) {
  if (assetLibrary) {
    assetLibrary.selectedAsset = assetLibrary.assets.find(a => a.id === assetId);
    assetLibrary.render();
  }
}

function closeAssetDetail() {
  if (assetLibrary) {
    assetLibrary.selectedAsset = null;
    assetLibrary.render();
  }
}
