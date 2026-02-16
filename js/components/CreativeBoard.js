// Creative Board - Kanban Workflow
class CreativeBoard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.columns = ['backlog', 'inProgress', 'review', 'approved', 'live'];
    this.creatives = this.initMockCreatives();
    this.draggedCard = null;
    this.init();
  }

  initMockCreatives() {
    return [
      { id: 'cr_001', title: 'Hero Banner - Enterprise', type: 'image', status: 'live', version: 'v2.1', comments: 3, assignee: 'MM', thumbnail: 'gradient', campaign: 'Q3 Enterprise Push' },
      { id: 'cr_002', title: 'Carousel Ad Set A', type: 'carousel', status: 'approved', version: 'v1.0', comments: 8, assignee: 'SS', thumbnail: 'gradient', campaign: 'Q3 Enterprise Push' },
      { id: 'cr_003', title: 'Video - Product Demo', type: 'video', status: 'review', version: 'v1.2', comments: 5, assignee: 'JD', thumbnail: 'gradient', campaign: 'Brand Awareness Q1' },
      { id: 'cr_004', title: 'Static - Features List', type: 'image', status: 'inProgress', version: 'v1.0', comments: 0, assignee: 'MM', thumbnail: 'gradient', campaign: 'Q3 Enterprise Push' },
      { id: 'cr_005', title: 'Story Ad - Vertical', type: 'story', status: 'backlog', version: 'v0.1', comments: 0, assignee: null, thumbnail: 'gradient', campaign: 'Brand Awareness Q1' },
      { id: 'cr_006', title: 'Email Header', type: 'image', status: 'inProgress', version: 'v2.0', comments: 2, assignee: 'AK', thumbnail: 'gradient', campaign: 'Spring Collection' },
      { id: 'cr_007', title: 'Retargeting Banner', type: 'image', status: 'review', version: 'v1.1', comments: 4, assignee: 'MM', thumbnail: 'gradient', campaign: 'Holiday Retargeting' },
      { id: 'cr_008', title: 'LinkedIn Sponsored', type: 'image', status: 'approved', version: 'v1.0', comments: 1, assignee: 'SS', thumbnail: 'gradient', campaign: 'Developer Conference' }
    ];
  }

  init() {
    this.render();
    this.attachDragListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="creative-board-header">
        <h2 class="dashboard-title">Creative Board</h2>
        <button class="btn btn-primary" onclick="showToast('Asset upload coming soon!', 'info')">
          + Add Creative
        </button>
      </div>
      
      <div class="board-filter-bar">
        <div class="filter-group">
          <span class="filter-label">Campaign:</span>
          <select class="filter-select" id="creativeCampaignFilter">
            <option value="all">All Campaigns</option>
            <option value="Q3 Enterprise Push">Q3 Enterprise Push</option>
            <option value="Brand Awareness Q1">Brand Awareness Q1</option>
            <option value="Spring Collection">Spring Collection</option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-label">Type:</span>
          <select class="filter-select" id="creativeTypeFilter">
            <option value="all">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>
      </div>
      
      <div class="board-container">
        ${this.columns.map(column => this.renderColumn(column)).join('')}
      </div>
    `;
    
    this.attachFilterListeners();
  }

  renderColumn(columnId) {
    const columnLabels = {
      backlog: 'Backlog',
      inProgress: 'In Progress',
      review: 'Review',
      approved: 'Approved',
      live: 'Live'
    };
    
    const creatives = this.getCreativesByStatus(columnId);
    
    return `
      <div class="board-column" data-column="${columnId}">
        <div class="column-header">
          <span class="column-title">${columnLabels[columnId]}</span>
          <span class="column-count">${creatives.length}</span>
        </div>
        <div class="column-body" data-column="${columnId}">
          ${creatives.map(creative => this.renderCreativeCard(creative)).join('')}
        </div>
      </div>
    `;
  }

  renderCreativeCard(creative) {
    const typeIcons = {
      image: '🖼️',
      video: '🎬',
      carousel: '🎠',
      story: '📱'
    };
    
    return `
      <div class="creative-card" draggable="true" data-id="${creative.id}" data-status="${creative.status}">
        <div class="creative-thumbnail" style="background: linear-gradient(135deg, #1e1e26, #2a2a35);">
          <span style="font-size: 2rem; opacity: 0.5;">${typeIcons[creative.type] || '📄'}</span>
          <div class="creative-overlay">
            <button class="btn btn-sm btn-primary">Preview</button>
          </div>
        </div>
        <div class="creative-info">
          <h4 class="creative-title">${creative.title}</h4>
          <span class="creative-type">${creative.type}</span>
          <div class="creative-meta">
            <span class="creative-version">${creative.version}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${creative.comments > 0 ? `<span class="creative-comments">💬 ${creative.comments}</span>` : ''}
              ${creative.assignee ? `<div class="creative-assignee" title="Assigned to ${creative.assignee}">${creative.assignee}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getCreativesByStatus(status) {
    const campaignFilter = document.getElementById('creativeCampaignFilter')?.value || 'all';
    const typeFilter = document.getElementById('creativeTypeFilter')?.value || 'all';
    
    return this.creatives.filter(c => {
      if (c.status !== status) return false;
      if (campaignFilter !== 'all' && c.campaign !== campaignFilter) return false;
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      return true;
    });
  }

  attachDragListeners() {
    this.container.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('creative-card')) {
        this.draggedCard = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    this.container.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('creative-card')) {
        e.target.classList.remove('dragging');
        this.draggedCard = null;
      }
    });

    this.container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const columnBody = e.target.closest('.column-body');
      if (columnBody) {
        columnBody.classList.add('drag-over');
      }
    });

    this.container.addEventListener('dragleave', (e) => {
      const columnBody = e.target.closest('.column-body');
      if (columnBody) {
        columnBody.classList.remove('drag-over');
      }
    });

    this.container.addEventListener('drop', (e) => {
      e.preventDefault();
      const columnBody = e.target.closest('.column-body');
      if (columnBody && this.draggedCard) {
        const newStatus = columnBody.dataset.column;
        const creativeId = this.draggedCard.dataset.id;
        
        // Update data
        const creative = this.creatives.find(c => c.id === creativeId);
        if (creative && creative.status !== newStatus) {
          creative.status = newStatus;
          
          // Visual feedback
          columnBody.classList.remove('drag-over');
          showToast(`Moved "${creative.title}" to ${newStatus}`, 'success');
          
          // Re-render
          this.render();
          this.attachDragListeners();
        }
      }
    });
  }

  attachFilterListeners() {
    const campaignFilter = document.getElementById('creativeCampaignFilter');
    const typeFilter = document.getElementById('creativeTypeFilter');
    
    if (campaignFilter) {
      campaignFilter.addEventListener('change', () => this.render());
    }
    if (typeFilter) {
      typeFilter.addEventListener('change', () => this.render());
    }
  }
}

// Initialize Creative Board when needed
function initCreativeBoard() {
  const container = document.getElementById('creativeBoardContainer');
  if (container) {
    new CreativeBoard('creativeBoardContainer');
  }
}
