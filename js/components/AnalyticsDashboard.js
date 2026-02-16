// Analytics Dashboard
class AnalyticsDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.dateRange = 7; // days
    this.metrics = this.generateMockData();
    this.init();
  }

  generateMockData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
      kpi: {
        spend: { value: 42500, change: 23, changeType: 'up' },
        clicks: { value: 128000, change: 45, changeType: 'up' },
        ctr: { value: 4.8, change: 12, changeType: 'up' },
        cpc: { value: 0.89, change: 8, changeType: 'down' }
      },
      chartData: {
        labels: days,
        spend: [5200, 6100, 5800, 7200, 6800, 5900, 6500],
        clicks: [15000, 18000, 17500, 22000, 21000, 18500, 20000],
        conversions: [450, 520, 490, 650, 610, 530, 580]
      },
      topCreatives: [
        { name: 'Hero Banner - Enterprise', ctr: 6.2, spend: 12500 },
        { name: 'Video - Product Demo', ctr: 5.8, spend: 18200 },
        { name: 'Carousel Ad Set A', ctr: 4.9, spend: 8900 },
        { name: 'Static - Features List', ctr: 3.7, spend: 5600 }
      ],
      platformBreakdown: {
        'Meta Ads': { spend: 22000, clicks: 65000 },
        'Google Ads': { spend: 15000, clicks: 45000 },
        'LinkedIn': { spend: 5500, clicks: 18000 }
      }
    };
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="analytics-header">
        <h2 class="dashboard-title">Analytics Dashboard</h2>
        <div class="analytics-controls">
          <div class="filter-group">
            <span class="filter-label">Range:</span>
            <select class="filter-select" id="dateRangeSelect">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="exportAnalytics()">Export CSV</button>
        </div>
      </div>
      
      ${this.renderKPIs()}
      ${this.renderMainChart()}
      ${this.renderBreakdownSection()}
    `;
    
    this.drawChart();
    this.attachListeners();
  }

  renderKPIs() {
    const kpiCards = [
      { key: 'spend', label: 'Total Spend', prefix: '$', suffix: '' },
      { key: 'clicks', label: 'Total Clicks', prefix: '', suffix: '' },
      { key: 'ctr', label: 'Avg CTR', prefix: '', suffix: '%' },
      { key: 'cpc', label: 'Avg CPC', prefix: '$', suffix: '' }
    ];
    
    return `
      <div class="kpi-grid">
        ${kpiCards.map(kpi => {
          const data = this.metrics.kpi[kpi.key];
          const changeClass = data.changeType === 'up' ? 'positive' : 'negative';
          const changeIcon = data.changeType === 'up' ? '↑' : '↓';
          const value = kpi.key === 'spend' || kpi.key === 'clicks' 
            ? this.formatNumber(data.value)
            : data.value.toFixed(kpi.key === 'ctr' ? 1 : 2);
          
          return `
            <div class="kpi-card">
              <p class="kpi-label">${kpi.label}</p>
              <h3 class="kpi-value">${kpi.prefix}${value}${kpi.suffix}</h3>
              <p class="kpi-change ${changeClass}">${changeIcon} ${data.change}%</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderMainChart() {
    return `
      <div class="chart-container" style="margin-top: 32px;">
        <div class="chart-header">
          <h3 class="chart-title">Performance Over Time</h3>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot cyan"></span>Spend</span>
            <span class="legend-item"><span class="legend-dot magenta"></span>Clicks</span>
            <span class="legend-item"><span class="legend-dot lime"></span>Conversions</span>
          </div>
        </div>
        <div class="chart-canvas-container">
          <canvas id="mainChart" width="800" height="300"></canvas>
        </div>
      </div>
    `;
  }

  renderBreakdownSection() {
    return `
      <div class="breakdown-grid" style="margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div class="chart-container">
          <h3 class="chart-title">Top Performing Creatives</h3>
          <div class="creative-performance-list" style="margin-top: 16px;">
            ${this.metrics.topCreatives.map((creative, i) => `
              <div class="performance-row" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--graphite);">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-family: var(--font-mono); color: var(--mist-white);">#${i + 1}</span>
                  <span>${creative.name}</span>
                </div>
                <div style="display: flex; gap: 24px; font-family: var(--font-mono); font-size: 0.875rem;">
                  <span style="color: var(--acid-lime);">${creative.ctr}% CTR</span>
                  <span style="color: var(--fog-white);">$${this.formatNumber(creative.spend)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="chart-container">
          <h3 class="chart-title">Platform Breakdown</h3>
          <div class="platform-breakdown" style="margin-top: 16px;">
            ${Object.entries(this.metrics.platformBreakdown).map(([platform, data]) => {
              const percentage = (data.spend / 42500 * 100).toFixed(1);
              return `
                <div class="platform-row" style="margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>${platform}</span>
                    <span style="font-family: var(--font-mono); color: var(--fog-white);">$${this.formatNumber(data.spend)} (${percentage}%)</span>
                  </div>
                  <div style="height: 8px; background: var(--charcoal); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--electric-cyan), var(--neon-magenta)); border-radius: 4px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  drawChart() {
    const canvas = document.getElementById('mainChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const data = this.metrics.chartData;
    const maxValue = Math.max(...data.spend, ...data.clicks, ...data.conversions.map(c => c * 100));
    
    // Draw grid lines
    ctx.strokeStyle = '#1e1e26';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
    
    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, i) => {
      const x = padding.left + (chartWidth / (data.labels.length - 1)) * i;
      ctx.fillText(label, x, height - 10);
    });
    
    // Draw lines
    this.drawLine(ctx, data.spend, maxValue, padding, chartWidth, chartHeight, '#00f0ff', 2);
    this.drawLine(ctx, data.clicks, maxValue, padding, chartWidth, chartHeight, '#ff006e', 2);
    this.drawLine(ctx, data.conversions.map(c => c * 10), maxValue, padding, chartWidth, chartHeight, '#ccff00', 2);
  }

  drawLine(ctx, values, maxValue, padding, chartWidth, chartHeight, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    values.forEach((value, i) => {
      const x = padding.left + (chartWidth / (values.length - 1)) * i;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = color;
    values.forEach((value, i) => {
      const x = padding.left + (chartWidth / (values.length - 1)) * i;
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  attachListeners() {
    const dateRange = document.getElementById('dateRangeSelect');
    if (dateRange) {
      dateRange.addEventListener('change', (e) => {
        this.dateRange = parseInt(e.target.value);
        showToast(`Updated to last ${this.dateRange} days`, 'info');
        // In real app, would fetch new data here
      });
    }
    
    // Redraw chart on resize
    window.addEventListener('resize', () => {
      this.drawChart();
    });
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

function exportAnalytics() {
  showToast('Exporting analytics data...', 'info');
  // In real app, would generate and download CSV
  setTimeout(() => {
    showToast('Analytics exported to CSV!', 'success');
  }, 1500);
}

// Initialize Analytics Dashboard when needed
function initAnalyticsDashboard() {
  const container = document.getElementById('analyticsContainer');
  if (container) {
    new AnalyticsDashboard('analyticsContainer');
  }
}
