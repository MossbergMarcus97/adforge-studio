// Campaign Store - State Management
class CampaignStore {
  constructor() {
    this.state = {
      campaigns: [],
      filter: 'all',
      searchQuery: '',
      sortBy: 'recent'
    };
    this.listeners = [];
    this.initMockData();
  }

  initMockData() {
    this.state.campaigns = [
      {
        id: 'camp_001',
        name: 'Q3 Enterprise Push',
        client: 'Northstar Ventures',
        brand: 'Northstar Cloud',
        status: 'active',
        budget: { spent: 12450, total: 15000 },
        metrics: { ctr: 4.2, clicks: 8500, conversions: 340 },
        sparklineData: [12, 15, 18, 22, 19, 25, 28, 26, 30, 32, 29, 35],
        assets: 6,
        daysRemaining: 12,
        createdAt: '2026-02-01'
      },
      {
        id: 'camp_002',
        name: 'Brand Awareness Q1',
        client: 'TechFlow',
        brand: 'TechFlow Pro',
        status: 'active',
        budget: { spent: 8200, total: 10000 },
        metrics: { ctr: 3.8, clicks: 6200, conversions: 180 },
        sparklineData: [8, 10, 12, 14, 16, 15, 18, 20, 22, 21, 24, 26],
        assets: 8,
        daysRemaining: 18,
        createdAt: '2026-01-15'
      },
      {
        id: 'camp_003',
        name: 'Product Launch - Gamma',
        client: 'Acme Corp',
        brand: 'Acme Labs',
        status: 'draft',
        budget: { spent: 0, total: 25000 },
        metrics: { ctr: 0, clicks: 0, conversions: 0 },
        sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        assets: 3,
        daysRemaining: 45,
        createdAt: '2026-02-14'
      },
      {
        id: 'camp_004',
        name: 'Holiday Retargeting',
        client: 'Shopify Plus',
        brand: 'Shopify Plus',
        status: 'paused',
        budget: { spent: 15000, total: 15000 },
        metrics: { ctr: 2.9, clicks: 12000, conversions: 420 },
        sparklineData: [20, 22, 24, 23, 25, 24, 0, 0, 0, 0, 0, 0],
        assets: 12,
        daysRemaining: 0,
        createdAt: '2025-12-01'
      },
      {
        id: 'camp_005',
        name: 'Developer Conference',
        client: 'GitLab',
        brand: 'GitLab',
        status: 'completed',
        budget: { spent: 30000, total: 30000 },
        metrics: { ctr: 5.1, clicks: 25000, conversions: 850 },
        sparklineData: [30, 35, 38, 42, 45, 48, 52, 55, 58, 60, 62, 65],
        assets: 15,
        daysRemaining: 0,
        createdAt: '2025-11-01'
      },
      {
        id: 'camp_006',
        name: 'Spring Collection',
        client: 'FashionCo',
        brand: 'FashionCo Studio',
        status: 'active',
        budget: { spent: 5600, total: 20000 },
        metrics: { ctr: 3.2, clicks: 4100, conversions: 95 },
        sparklineData: [5, 7, 9, 11, 13, 15, 14, 16, 18, 20, 22, 24],
        assets: 10,
        daysRemaining: 60,
        createdAt: '2026-02-10'
      }
    ];
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  getFilteredCampaigns() {
    let campaigns = this.state.campaigns;
    
    // Filter by status
    if (this.state.filter !== 'all') {
      campaigns = campaigns.filter(c => c.status === this.state.filter);
    }
    
    // Filter by search
    if (this.state.searchQuery) {
      const query = this.state.searchQuery.toLowerCase();
      campaigns = campaigns.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.client.toLowerCase().includes(query) ||
        c.brand.toLowerCase().includes(query)
      );
    }
    
    // Sort
    switch (this.state.sortBy) {
      case 'recent':
        campaigns = campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'budget':
        campaigns = campaigns.sort((a, b) => b.budget.total - a.budget.total);
        break;
      case 'performance':
        campaigns = campaigns.sort((a, b) => b.metrics.ctr - a.metrics.ctr);
        break;
    }
    
    return campaigns;
  }

  setFilter(filter) {
    this.state.filter = filter;
    this.notify();
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.notify();
  }

  setSortBy(sortBy) {
    this.state.sortBy = sortBy;
    this.notify();
  }

  duplicateCampaign(id) {
    const campaign = this.state.campaigns.find(c => c.id === id);
    if (campaign) {
      const newCampaign = {
        ...campaign,
        id: `camp_${Date.now()}`,
        name: `${campaign.name} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.state.campaigns.push(newCampaign);
      this.notify();
      return newCampaign;
    }
  }

  toggleCampaignStatus(id) {
    const campaign = this.state.campaigns.find(c => c.id === id);
    if (campaign) {
      const statusFlow = { active: 'paused', paused: 'active', draft: 'active' };
      campaign.status = statusFlow[campaign.status] || campaign.status;
      this.notify();
    }
  }
}

// Global store instance
const store = new CampaignStore();
