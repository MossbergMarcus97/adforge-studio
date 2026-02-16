// HTML Ad Generator - Dynamic Ad Creation
class AdGenerator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.templates = this.initTemplates();
    this.currentTemplate = 'banner';
    this.adConfig = {
      headline: 'Launch Fast with Brand Clarity',
      subheadline: 'Every campaign inherits this system with intentional hierarchy.',
      cta: 'Get Started',
      ctaUrl: 'https://example.com',
      primaryColor: '#00f0ff',
      secondaryColor: '#ff006e',
      backgroundImage: null,
      logo: null,
      width: 300,
      height: 250
    };
    this.init();
  }

  initTemplates() {
    return {
      banner: {
        name: 'Standard Banner',
        description: '300x250 display banner',
        defaultSize: { width: 300, height: 250 }
      },
      leaderboard: {
        name: 'Leaderboard',
        description: '728x90 horizontal banner',
        defaultSize: { width: 728, height: 90 }
      },
      skyscraper: {
        name: 'Skyscraper',
        description: '160x600 vertical banner',
        defaultSize: { width: 160, height: 600 }
      },
      rectangle: {
        name: 'Medium Rectangle',
        description: '300x600 large format',
        defaultSize: { width: 300, height: 600 }
      },
      social: {
        name: 'Social Feed',
        description: '1080x1080 square (1:1)',
        defaultSize: { width: 1080, height: 1080 }
      },
      story: {
        name: 'Story/Reels',
        description: '1080x1920 vertical (9:16)',
        defaultSize: { width: 1080, height: 1920 }
      }
    };
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="dashboard-header">
        <h2 class="dashboard-title">HTML Ad Generator</h2>
        <button class="btn btn-primary" onclick="exportGeneratedAd()">
          Export HTML
        </button>
      </div>
      
      <div class="ad-generator-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 32px;">
        <!-- Configuration Panel -->
        <div class="ad-config-panel">
          <div class="config-section">
            <h4>Template</h4>
            <select class="filter-select" id="templateSelect" style="width: 100%; margin-bottom: 16px;">
              ${Object.entries(this.templates).map(([key, template]) => 
                `<option value="${key}" ${key === this.currentTemplate ? 'selected' : ''}>${template.name}</option>`
              ).join('')}
            </select>
            <p style="font-size: 0.8rem; color: var(--fog-white);">${this.templates[this.currentTemplate].description}</p>
          </div>
          
          <div class="config-section">
            <h4>Dimensions</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>
                <label style="font-size: 0.75rem; color: var(--fog-white);">Width (px)</label>
                <input type="number" class="input" id="adWidth" value="${this.adConfig.width}" style="margin-top: 4px;">
              </div>
              <div>
                <label style="font-size: 0.75rem; color: var(--fog-white);">Height (px)</label>
                <input type="number" class="input" id="adHeight" value="${this.adConfig.height}" style="margin-top: 4px;">
              </div>
            </div>
          </div>
          
          <div class="config-section">
            <h4>Content</h4>
            <label style="font-size: 0.75rem; color: var(--fog-white);">Headline</label>
            <input type="text" class="input" id="adHeadline" value="${this.adConfig.headline}" style="margin-bottom: 12px; margin-top: 4px;">
            
            <label style="font-size: 0.75rem; color: var(--fog-white);">Subheadline</label>
            <textarea class="input" id="adSubheadline" rows="2" style="margin-bottom: 12px; margin-top: 4px;">${this.adConfig.subheadline}</textarea>
            
            <label style="font-size: 0.75rem; color: var(--fog-white);">CTA Text</label>
            <input type="text" class="input" id="adCta" value="${this.adConfig.cta}" style="margin-bottom: 12px; margin-top: 4px;">
            
            <label style="font-size: 0.75rem; color: var(--fog-white);">CTA URL</label>
            <input type="text" class="input" id="adCtaUrl" value="${this.adConfig.ctaUrl}" style="margin-top: 4px;">
          </div>
          
          <div class="config-section">
            <h4>Colors</h4>
            <div style="display: flex; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="font-size: 0.75rem; color: var(--fog-white);">Primary</label>
                <input type="color" id="adPrimaryColor" value="${this.adConfig.primaryColor}" style="width: 60px; height: 40px; margin-top: 4px; border: none; border-radius: 8px; cursor: pointer;">
              </div>
              <div>
                <label style="font-size: 0.75rem; color: var(--fog-white);">Secondary</label>
                <input type="color" id="adSecondaryColor" value="${this.adConfig.secondaryColor}" style="width: 60px; height: 40px; margin-top: 4px; border: none; border-radius: 8px; cursor: pointer;">
              </div>
            </div>
          </div>
        </div>
        
        <!-- Preview & Code -->
        <div class="ad-preview-section">
          <div class="preview-container" style="background: var(--charcoal); border-radius: 12px; padding: 32px; display: flex; justify-content: center; align-items: center; min-height: 400px;">
            ${this.generateAdHTML()}
          </div>
          
          <div class="code-export" style="margin-top: 24px;">
            <h4 style="margin-bottom: 12px;">Generated HTML</h4>
            <pre style="background: var(--ink-black); border: 1px solid var(--graphite); border-radius: 8px; padding: 16px; overflow-x: auto; font-family: var(--font-mono); font-size: 0.75rem; color: var(--fog-white); max-height: 200px; overflow-y: auto;"><code>${this.escapeHtml(this.generateAdCode())}</code></pre>
          </div>
        </div>
      </div>
    `;
    
    this.attachEventListeners();
  }

  generateAdHTML() {
    const { width, height, headline, subheadline, cta, ctaUrl, primaryColor, secondaryColor } = this.adConfig;
    
    // Calculate responsive preview scale
    const maxPreviewWidth = 400;
    const scale = Math.min(maxPreviewWidth / width, 1);
    
    return `
      <div class="ad-preview-wrapper" style="transform: scale(${scale}); transform-origin: center;">
        <a href="${ctaUrl}" target="_blank" style="text-decoration: none;">
          <div class="generated-ad" style="
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22);
            border: 2px solid ${primaryColor};
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            box-shadow: 0 0 40px ${primaryColor}40;
            position: relative;
            overflow: hidden;
          ">
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10);
              pointer-events: none;
            "></div>
            
            <h3 style="
              font-family: 'Space Grotesk', sans-serif;
              font-size: ${width > 400 ? '2rem' : '1.25rem'};
              font-weight: 700;
              color: #ffffff;
              margin: 0 0 12px;
              text-shadow: 0 0 20px ${primaryColor}80;
              position: relative;
              z-index: 1;
            ">${headline}</h3>
            
            <p style="
              font-family: 'Inter', sans-serif;
              font-size: ${width > 400 ? '1rem' : '0.75rem'};
              color: rgba(255, 255, 255, 0.8);
              margin: 0 0 20px;
              line-height: 1.4;
              position: relative;
              z-index: 1;
            ">${subheadline}</p>
            
            <span style="
              display: inline-block;
              padding: 12px 28px;
              background: ${primaryColor};
              color: #050505;
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: ${width > 400 ? '1rem' : '0.875rem'};
              border-radius: 999px;
              box-shadow: 0 0 20px ${primaryColor}60;
              transition: transform 0.2s;
              position: relative;
              z-index: 1;
            ">${cta}</span>
          </div>
        </a>
      </div>
    `;
  }

  generateAdCode() {
    const { width, height, headline, subheadline, cta, ctaUrl, primaryColor, secondaryColor } = this.adConfig;
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ad</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .ad-container {
      width: ${width}px;
      height: ${height}px;
      background: linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22);
      border: 2px solid ${primaryColor};
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      box-shadow: 0 0 40px ${primaryColor}40;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      text-decoration: none;
    }
    .ad-container::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10);
      pointer-events: none;
    }
    .ad-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: ${width > 400 ? '2rem' : '1.25rem'};
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 12px;
      text-shadow: 0 0 20px ${primaryColor}80;
      position: relative;
      z-index: 1;
    }
    .ad-subheadline {
      font-family: 'Inter', sans-serif;
      font-size: ${width > 400 ? '1rem' : '0.75rem'};
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 20px;
      line-height: 1.4;
      position: relative;
      z-index: 1;
    }
    .ad-cta {
      display: inline-block;
      padding: 12px 28px;
      background: ${primaryColor};
      color: #050505;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: ${width > 400 ? '1rem' : '0.875rem'};
      border-radius: 999px;
      box-shadow: 0 0 20px ${primaryColor}60;
      position: relative;
      z-index: 1;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .ad-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 30px ${primaryColor}80;
    }
  </style>
</head>
<body style="background: #050505; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;">
  <a href="${ctaUrl}" target="_blank" class="ad-container">
    <h3 class="ad-headline">${headline}</h3>
    <p class="ad-subheadline">${subheadline}</p>
    <span class="ad-cta">${cta}</span>
  </a>
</body>
</html>`;
  }

  attachEventListeners() {
    // Template select
    const templateSelect = document.getElementById('templateSelect');
    if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
        this.currentTemplate = e.target.value;
        const template = this.templates[this.currentTemplate];
        this.adConfig.width = template.defaultSize.width;
        this.adConfig.height = template.defaultSize.height;
        this.render();
      });
    }
    
    // Dimension inputs
    const widthInput = document.getElementById('adWidth');
    const heightInput = document.getElementById('adHeight');
    if (widthInput) {
      widthInput.addEventListener('input', (e) => {
        this.adConfig.width = parseInt(e.target.value) || 300;
        this.render();
      });
    }
    if (heightInput) {
      heightInput.addEventListener('input', (e) => {
        this.adConfig.height = parseInt(e.target.value) || 250;
        this.render();
      });
    }
    
    // Content inputs
    const headlineInput = document.getElementById('adHeadline');
    const subheadlineInput = document.getElementById('adSubheadline');
    const ctaInput = document.getElementById('adCta');
    const ctaUrlInput = document.getElementById('adCtaUrl');
    
    if (headlineInput) {
      headlineInput.addEventListener('input', (e) => {
        this.adConfig.headline = e.target.value;
        this.render();
      });
    }
    if (subheadlineInput) {
      subheadlineInput.addEventListener('input', (e) => {
        this.adConfig.subheadline = e.target.value;
        this.render();
      });
    }
    if (ctaInput) {
      ctaInput.addEventListener('input', (e) => {
        this.adConfig.cta = e.target.value;
        this.render();
      });
    }
    if (ctaUrlInput) {
      ctaUrlInput.addEventListener('input', (e) => {
        this.adConfig.ctaUrl = e.target.value;
        this.render();
      });
    }
    
    // Color inputs
    const primaryColorInput = document.getElementById('adPrimaryColor');
    const secondaryColorInput = document.getElementById('adSecondaryColor');
    
    if (primaryColorInput) {
      primaryColorInput.addEventListener('input', (e) => {
        this.adConfig.primaryColor = e.target.value;
        this.render();
      });
    }
    if (secondaryColorInput) {
      secondaryColorInput.addEventListener('input', (e) => {
        this.adConfig.secondaryColor = e.target.value;
        this.render();
      });
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

let adGenerator;

function initAdGenerator() {
  const container = document.getElementById('adGeneratorContainer');
  if (container) {
    adGenerator = new AdGenerator('adGeneratorContainer');
  }
}

function exportGeneratedAd() {
  if (adGenerator) {
    const code = adGenerator.generateAdCode();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ad-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Ad HTML exported!', 'success');
  }
}
