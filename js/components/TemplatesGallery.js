// Templates Gallery — Browse and Start from Inspiration
class TemplatesGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.templates = this.initTemplates();
    this.filter = 'all';
    this.searchQuery = '';
    this.init();
  }

  initTemplates() {
    return [
      {
        id: 't1',
        name: 'Minimal CTA',
        category: 'banner',
        industry: 'saas',
        style: 'minimal',
        size: { width: 300, height: 250 },
        preview: 'minimal-cta',
        colors: ['#00f0ff', '#050505'],
        description: 'Clean banner with strong call-to-action'
      },
      {
        id: 't2',
        name: 'Product Showcase',
        category: 'banner',
        industry: 'ecommerce',
        style: 'bold',
        size: { width: 728, height: 90 },
        preview: 'product-showcase',
        colors: ['#ff006e', '#1a1a1a'],
        description: 'Highlight your product with bold colors'
      },
      {
        id: 't3',
        name: 'Social Announcement',
        category: 'social',
        industry: 'general',
        style: 'modern',
        size: { width: 1080, height: 1080 },
        preview: 'social-announcement',
        colors: ['#00f0ff', '#ff006e', '#050505'],
        description: 'Square format for Instagram/Facebook'
      },
      {
        id: 't4',
        name: 'Story Promo',
        category: 'story',
        industry: 'retail',
        style: 'gradient',
        size: { width: 1080, height: 1920 },
        preview: 'story-promo',
        colors: ['#ff006e', '#7928ca'],
        description: 'Vertical story format for maximum impact'
      },
      {
        id: 't5',
        name: 'Holiday Sale',
        category: 'banner',
        industry: 'retail',
        style: 'festive',
        size: { width: 300, height: 600 },
        preview: 'holiday-sale',
        colors: ['#ff006e', '#00ff88'],
        description: 'Festive design for seasonal campaigns'
      },
      {
        id: 't6',
        name: 'App Download',
        category: 'social',
        industry: 'tech',
        style: 'clean',
        size: { width: 1200, height: 628 },
        preview: 'app-download',
        colors: ['#00f0ff', '#ffffff'],
        description: 'Optimized for app install campaigns'
      },
      {
        id: 't7',
        name: 'Webinar Invite',
        category: 'banner',
        industry: 'b2b',
        style: 'professional',
        size: { width: 160, height: 600 },
        preview: 'webinar-invite',
        colors: ['#7928ca', '#1a1a1a'],
        description: 'Professional design for B2B events'
      },
      {
        id: 't8',
        name: 'Flash Sale',
        category: 'social',
        industry: 'retail',
        style: 'urgent',
        size: { width: 1080, height: 1080 },
        preview: 'flash-sale',
        colors: ['#ff006e', '#ffcc00'],
        description: 'High urgency with countdown feel'
      }
    ];
  }

  init() {
    this.render();
  }

  render() {
    const filteredTemplates = this.getFilteredTemplates();

    this.container.innerHTML = `
      <div class="templates-header">
        <div>
          <h2 class="templates-title">Start from a Template</h2>
          <p class="templates-subtitle">Choose from professionally designed starting points</p>
        </div>
        <div class="templates-actions">
          <input type="text" class="template-search" placeholder="Search templates..." value="${this.searchQuery}" oninput="templatesGallery.search(this.value)">
        </div>
      </div>

      <div class="templates-filters">
        <div class="filter-group">
          <span class="filter-label">Format:</span>
          <select class="filter-select" onchange="templatesGallery.setFilter('category', this.value)">
            <option value="all">All Formats</option>
            <option value="banner" ${this.filter === 'banner' ? 'selected' : ''}>Banner Ads</option>
            <option value="social" ${this.filter === 'social' ? 'selected' : ''}>Social Media</option>
            <option value="story" ${this.filter === 'story' ? 'selected' : ''}>Stories</option>
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Industry:</span>
          <select class="filter-select" onchange="templatesGallery.setFilter('industry', this.value)">
            <option value="all">All Industries</option>
            <option value="saas">SaaS</option>
            <option value="ecommerce">E-commerce</option>
            <option value="retail">Retail</option>
            <option value="b2b">B2B</option>
            <option value="tech">Tech</option>
          </select>
        </div>

        <div class="filter-group" style="margin-left: auto;">
          <span class="filter-label">${filteredTemplates.length} templates</span>
        </div>
      </div>

      <div class="templates-grid">
        ${filteredTemplates.map(t => this.renderTemplateCard(t)).join('')}
      </div>
    `;
  }

  renderTemplateCard(template) {
    const sizeLabel = `${template.size.width}×${template.size.height}`;

    return `
      <div class="template-card" onclick="templatesGallery.selectTemplate('${template.id}')">
        <div class="template-preview" style="background: linear-gradient(135deg, ${template.colors[0]}22, ${template.colors[1] || template.colors[0]}22);">
          <div class="template-preview-content" style="border: 2px solid ${template.colors[0]};">
            <div class="template-preview-inner" style="background: ${template.colors[1] || '#050505'};">
              <span class="template-emoji">${this.getTemplateEmoji(template.category)}</span>
              <span class="template-size-badge">${sizeLabel}</span>
            </div>
          </div>
        </div>
        <div class="template-info">
          <h4 class="template-name">${template.name}</h4>
          <p class="template-description">${template.description}</p>
          <div class="template-meta">
            <span class="template-tag">${template.industry}</span>
            <span class="template-tag">${template.style}</span>
          </div>
        </div>
        <div class="template-overlay">
          <button class="btn btn-primary template-use-btn">Use Template</button>
        </div>
      </div>
    `;
  }

  getTemplateEmoji(category) {
    const emojis = {
      banner: '🎯',
      social: '📱',
      story: '📲'
    };
    return emojis[category] || '🎨';
  }

  getFilteredTemplates() {
    return this.templates.filter(t => {
      if (this.filter !== 'all' && t.category !== this.filter && t.industry !== this.filter) return false;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return t.name.toLowerCase().includes(query) ||
               t.description.toLowerCase().includes(query) ||
               t.industry.toLowerCase().includes(query);
      }
      return true;
    });
  }

  setFilter(type, value) {
    this.filter = value;
    this.render();
  }

  search(query) {
    this.searchQuery = query;
    this.render();
  }

  selectTemplate(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (template) {
      showToast(`Creating from "${template.name}"...`, 'success');

      // Switch to studio and create new artboard from template
      switchView('studio');

      if (studio) {
        const newArtboard = {
          id: `ab${studio.artboards.length + 1}`,
          name: template.name,
          width: template.size.width,
          height: template.size.height,
          x: 100 + studio.artboards.length * 50,
          y: 100 + studio.artboards.length * 50,
          background: '#050505'
        };

        studio.artboards.push(newArtboard);

        // Add template elements based on template type
        if (template.category === 'banner') {
          studio.elements.push(
            { id: `el${Date.now()}_1`, artboardId: newArtboard.id, type: 'text', x: 20, y: 30, width: 260, height: 40, content: 'Headline Here', fontSize: 24, color: '#ffffff' },
            { id: `el${Date.now()}_2`, artboardId: newArtboard.id, type: 'text', x: 20, y: 80, width: 260, height: 60, content: 'Subheadline text goes here', fontSize: 14, color: '#aaaaaa' },
            { id: `el${Date.now()}_3`, artboardId: newArtboard.id, type: 'rect', x: 20, y: template.size.height - 70, width: 120, height: 40, fill: template.colors[0], borderRadius: 20 }
          );
        } else if (template.category === 'social') {
          studio.elements.push(
            { id: `el${Date.now()}_1`, artboardId: newArtboard.id, type: 'text', x: 40, y: 80, width: template.size.width - 80, height: 60, content: 'Social Post Headline', fontSize: 48, color: '#ffffff' },
            { id: `el${Date.now()}_2`, artboardId: newArtboard.id, type: 'rect', x: 40, y: template.size.height - 120, width: 200, height: 60, fill: template.colors[0], borderRadius: 30 }
          );
        } else {
          studio.elements.push(
            { id: `el${Date.now()}_1`, artboardId: newArtboard.id, type: 'text', x: 40, y: 200, width: template.size.width - 80, height: 100, content: 'Story Title', fontSize: 72, color: '#ffffff' }
          );
        }

        studio.selectArtboard(newArtboard.id);
        studio.render();
      }
    }
  }
}

let templatesGallery;

function initTemplatesGallery() {
  const container = document.getElementById('templatesContainer');
  if (container) {
    templatesGallery = new TemplatesGallery('templatesContainer');
  }
}
