// Campaign Card Component
function createCampaignCard(campaign) {
  const card = document.createElement('div');
  card.className = `campaign-card status-${campaign.status}`;
  card.dataset.id = campaign.id;
  
  const budgetPercent = Math.round((campaign.budget.spent / campaign.budget.total) * 100);
  const sparklinePath = generateSparklinePath(campaign.sparklineData);
  
  card.innerHTML = `
    <div class="campaign-card-header">
      <div class="campaign-status-badge ${campaign.status}">
        ${campaign.status}
      </div>
      <button class="campaign-menu" onclick="showCampaignMenu('${campaign.id}')">⋮</button>
    </div>
    
    <div class="campaign-card-body">
      <h3 class="campaign-name">${campaign.name}</h3>
      <p class="campaign-brand">${campaign.brand}</p>
      
      <div class="campaign-metrics">
        <div class="metric">
          <span class="metric-value ${campaign.metrics.ctr > 3 ? 'positive' : ''}">${campaign.metrics.ctr}%</span>
          <span class="metric-label">CTR</span>
        </div>
        <div class="metric">
          <span class="metric-value">${formatNumber(campaign.metrics.clicks)}</span>
          <span class="metric-label">Clicks</span>
        </div>
        <div class="metric">
          <span class="metric-value">${campaign.assets}</span>
          <span class="metric-label">Assets</span>
        </div>
      </div>
      
      <div class="sparkline">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="${sparklinePath}" fill="none" stroke="#00f0ff" stroke-width="2" vector-effect="non-scaling-stroke"/>
        </svg>
      </div>
    </div>
    
    <div class="campaign-footer">
      <span class="campaign-budget">
        <strong>$${formatNumber(campaign.budget.spent)}</strong> / $${formatNumber(campaign.budget.total)}
      </span>
      <div class="campaign-actions">
        <button class="btn btn-secondary btn-sm" onclick="toggleCampaign('${campaign.id}')">
          ${campaign.status === 'active' ? 'Pause' : 'Activate'}
        </button>
        <button class="btn btn-ghost btn-sm" onclick="duplicateCampaign('${campaign.id}')">Duplicate</button>
      </div>
    </div>
  `;
  
  return card;
}

// Generate SVG path for sparkline
function generateSparklinePath(data) {
  if (!data || data.length === 0) return '';
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 30 - ((value - min) / range) * 30;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Campaign Menu Actions
function showCampaignMenu(id) {
  const campaign = store.state.campaigns.find(c => c.id === id);
  if (!campaign) return;
  
  const action = confirm(`Campaign: ${campaign.name}\n\nActions:\n• Click OK to Edit\n• Click Cancel for Details`);
  if (action) {
    showToast(`Opening editor for "${campaign.name}"...`, 'info');
  }
}

function toggleCampaign(id) {
  store.toggleCampaignStatus(id);
  const campaign = store.state.campaigns.find(c => c.id === id);
  showToast(`Campaign "${campaign.name}" is now ${campaign.status}`, campaign.status === 'active' ? 'success' : 'warning');
}

function duplicateCampaign(id) {
  const newCampaign = store.duplicateCampaign(id);
  if (newCampaign) {
    showToast(`Duplicated as "${newCampaign.name}"`, 'success');
  }
}

// Toast Notification System
function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-header">
      <span class="toast-title">${type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ'} ${type.toUpperCase()}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <p class="toast-message">${message}</p>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}
