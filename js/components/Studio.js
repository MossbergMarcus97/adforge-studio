// Studio — Fixed Drag Positioning & Property Inputs
class Studio {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.isDragging = false;
    this.dragTarget = null;
    this.dragType = null;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragStartMouseX = 0;
    this.dragStartMouseY = 0;
    this.activeTool = 'select';
    this.selectedElementId = null;
    this.selectedArtboardId = 'ab1';
    this.artboards = [
      { id: 'ab1', name: 'Banner 300×250', width: 300, height: 250, x: 100, y: 100, background: '#050505' },
      { id: 'ab2', name: 'Social 1080×1080', width: 1080, height: 1080, x: 500, y: 50, background: '#050505' }
    ];
    this.elements = [
      { id: 'el1', artboardId: 'ab1', type: 'text', x: 20, y: 30, width: 260, height: 40, content: 'Launch Fast', fontSize: 24, color: '#ffffff' },
      { id: 'el2', artboardId: 'ab1', type: 'rect', x: 20, y: 180, width: 120, height: 40, fill: '#00f0ff', borderRadius: 20 }
    ];
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="studio-layout">
        <div class="scenes-panel">
          <div class="panel-header">
            <h3>Scenes</h3>
            <button class="btn-icon" id="addArtboardBtn">+</button>
          </div>
          <div class="scenes-list" id="scenesList">
            ${this.artboards.map(ab => `
              <div class="scene-item ${this.selectedArtboardId === ab.id ? 'active' : ''}" data-artboard-id="${ab.id}">
                <div class="scene-thumbnail" style="aspect-ratio: ${ab.width}/${ab.height}; background: ${ab.background};">
                  <span style="font-size: 0.6rem; opacity: 0.5;">${ab.width}×${ab.height}</span>
                </div>
                <span class="scene-name">${ab.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="canvas-area" id="canvasArea">
          <div class="canvas-viewport" id="canvasViewport" style="transform: translate(${this.panX}px, ${this.panY}px) scale(${this.zoom});">
            <div class="canvas-grid"></div>
            ${this.artboards.map(ab => this.renderArtboard(ab)).join('')}
          </div>
          <div class="canvas-controls">
            <button class="control-btn" id="zoomOutBtn">−</button>
            <span class="zoom-level" id="zoomLevel">${Math.round(this.zoom * 100)}%</span>
            <button class="control-btn" id="zoomInBtn">+</button>
            <button class="control-btn" id="resetViewBtn">⌘</button>
          </div>
        </div>
        <div class="properties-panel" id="propertiesPanel">
          <div class="panel-header"><h3>Properties</h3></div>
          <div class="properties-content" id="propertiesContent">
            ${this.selectedElementId ? this.renderElementProperties() : this.renderArtboardProperties()}
          </div>
        </div>
      </div>
      <div class="studio-toolbar">
        <div class="tool-group">
          <button class="tool-btn ${this.activeTool === 'select' ? 'active' : ''}" data-tool="select">🖱️</button>
          <button class="tool-btn ${this.activeTool === 'text' ? 'active' : ''}" data-tool="text">📝</button>
          <button class="tool-btn ${this.activeTool === 'image' ? 'active' : ''}" data-tool="image">🖼️</button>
          <button class="tool-btn ${this.activeTool === 'shape' ? 'active' : ''}" data-tool="shape">🔷</button>
        </div>
        <div class="tool-divider"></div>
        <div class="tool-group">
          <button class="tool-btn" id="undoBtn">↶</button>
          <button class="tool-btn" id="redoBtn">↷</button>
        </div>
        <div class="tool-divider"></div>
        <div class="tool-group">
          <button class="tool-btn preview-btn" id="previewBtn">▶ Preview</button>
        </div>
      </div>
    `;
  }

  renderArtboard(ab) {
    const isSelected = this.selectedArtboardId === ab.id;
    const artboardElements = this.elements.filter(el => el.artboardId === ab.id);
    return `
      <div class="artboard ${isSelected ? 'selected' : ''}" data-artboard-id="${ab.id}"
           style="left: ${ab.x}px; top: ${ab.y}px; width: ${ab.width}px; height: ${ab.height}px; background: ${ab.background};">
        <div class="artboard-header" data-draggable="artboard" data-artboard-id="${ab.id}">
          <span class="artboard-name">${ab.name}</span>
          <span class="artboard-dims">${ab.width} × ${ab.height}</span>
        </div>
        <div class="artboard-content">
          ${artboardElements.map(el => this.renderElement(el)).join('')}
        </div>
      </div>
    `;
  }

  renderElement(el) {
    const isSelected = this.selectedElementId === el.id;
    const style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;`;
    if (el.type === 'text') {
      return `<div class="canvas-element text-element ${isSelected ? 'selected' : ''}" data-element-id="${el.id}" data-draggable="element" style="${style} color: ${el.color}; font-size: ${el.fontSize}px;">${el.content}</div>`;
    } else if (el.type === 'rect') {
      return `<div class="canvas-element shape-element ${isSelected ? 'selected' : ''}" data-element-id="${el.id}" data-draggable="element" style="${style} background: ${el.fill}; border-radius: ${el.borderRadius}px;"></div>`;
    }
    return '';
  }

  renderArtboardProperties() {
    const ab = this.artboards.find(a => a.id === this.selectedArtboardId) || this.artboards[0];
    return `
      <div class="property-section">
        <h4>Artboard</h4>
        <div class="property-row">
          <label>Name</label>
          <input type="text" class="prop-input" id="prop-ab-name" value="${ab.name}">
        </div>
        <div class="property-row cols-2">
          <div><label>Width</label><input type="number" class="prop-input" id="prop-ab-width" value="${ab.width}"></div>
          <div><label>Height</label><input type="number" class="prop-input" id="prop-ab-height" value="${ab.height}"></div>
        </div>
      </div>
      <div class="property-section">
        <h4>Background</h4>
        <div class="color-picker-row">
          <input type="color" id="prop-ab-bg" value="${ab.background}">
          <span id="prop-ab-bg-display">${ab.background}</span>
        </div>
      </div>
      <div class="property-section">
        <h4>Export</h4>
        <button class="btn-secondary" id="exportPngBtn">Export PNG</button>
        <button class="btn-secondary" id="exportHtmlBtn" style="margin-top: 8px;">Export HTML</button>
      </div>
    `;
  }

  renderElementProperties() {
    const el = this.elements.find(e => e.id === this.selectedElementId);
    if (!el) return this.renderArtboardProperties();
    
    let specificProps = '';
    if (el.type === 'text') {
      specificProps = `
        <div class="property-section">
          <h4>Typography</h4>
          <div class="property-row"><label>Content</label><textarea class="prop-input" id="prop-el-content" rows="2">${el.content}</textarea></div>
          <div class="property-row"><label>Font Size</label><input type="number" class="prop-input" id="prop-el-fontSize" value="${el.fontSize}"></div>
          <div class="property-row"><label>Color</label><input type="color" id="prop-el-color" value="${el.color}"></div>
        </div>`;
    } else {
      specificProps = `
        <div class="property-section">
          <h4>Appearance</h4>
          <div class="property-row"><label>Fill Color</label><input type="color" id="prop-el-fill" value="${el.fill}"></div>
          <div class="property-row"><label>Border Radius</label><input type="number" class="prop-input" id="prop-el-borderRadius" value="${el.borderRadius}"></div>
        </div>`;
    }
    
    return `
      <div class="property-section">
        <h4>Position & Size</h4>
        <div class="property-row cols-2">
          <div><label>X</label><input type="number" class="prop-input" id="prop-el-x" value="${Math.round(el.x)}"></div>
          <div><label>Y</label><input type="number" class="prop-input" id="prop-el-y" value="${Math.round(el.y)}"></div>
        </div>
        <div class="property-row cols-2">
          <div><label>Width</label><input type="number" class="prop-input" id="prop-el-width" value="${Math.round(el.width)}"></div>
          <div><label>Height</label><input type="number" class="prop-input" id="prop-el-height" value="${Math.round(el.height)}"></div>
        </div>
      </div>
      ${specificProps}
      <div class="property-section">
        <button class="btn-danger" id="deleteElementBtn">Delete Element</button>
      </div>
    `;
  }

  attachEventListeners() {
    // Toolbar tools
    this.container.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTool = btn.dataset.tool;
      });
    });

    // Controls
    document.getElementById('zoomInBtn')?.addEventListener('click', () => { this.zoom *= 1.2; this.updateTransform(); });
    document.getElementById('zoomOutBtn')?.addEventListener('click', () => { this.zoom /= 1.2; this.updateTransform(); });
    document.getElementById('resetViewBtn')?.addEventListener('click', () => { this.zoom = 1; this.panX = 0; this.panY = 0; this.updateTransform(); });
    document.getElementById('previewBtn')?.addEventListener('click', () => this.togglePreview());
    document.getElementById('addArtboardBtn')?.addEventListener('click', () => this.addNewArtboard());

    // Canvas interactions
    const canvasArea = document.getElementById('canvasArea');

    this.container.addEventListener('mousedown', (e) => {
      const draggable = e.target.closest('[data-draggable]');
      const element = e.target.closest('[data-element-id]');
      const sceneItem = e.target.closest('.scene-item[data-artboard-id]');

      // Scene selection
      if (sceneItem) {
        this.selectArtboard(sceneItem.dataset.artboardId);
        return;
      }

      // Element selection (just click, not drag)
      if (element && !draggable && this.activeTool === 'select') {
        e.stopPropagation();
        this.selectElement(element.dataset.elementId);
        return;
      }

      // Start dragging
      if (draggable && this.activeTool === 'select') {
        e.preventDefault();
        e.stopPropagation();
        const type = draggable.dataset.draggable;
        
        if (type === 'element') {
          const elId = draggable.dataset.elementId;
          this.selectElement(elId);
          this.startDrag(e, 'element', elId);
        } else if (type === 'artboard') {
          const abId = draggable.closest('.artboard').dataset.artboardId;
          this.selectArtboard(abId);
          this.startDrag(e, 'artboard', abId);
        }
        return;
      }

      // Canvas panning
      if (e.target === canvasArea || e.target.classList.contains('canvas-grid')) {
        this.isPanning = true;
        this.panStartX = e.clientX - this.panX;
        this.panStartY = e.clientY - this.panY;
        canvasArea.style.cursor = 'grabbing';
        this.deselectAll();
      }
    });

    // Global mouse move
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.handleDrag(e);
      } else if (this.isPanning) {
        this.panX = e.clientX - this.panStartX;
        this.panY = e.clientY - this.panStartY;
        this.updateTransform();
      }
    });

    // Global mouse up
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.endDrag();
      }
      if (this.isPanning) {
        this.isPanning = false;
        canvasArea.style.cursor = 'default';
      }
    });

    // Wheel zoom
    canvasArea?.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom = Math.max(0.1, Math.min(3, this.zoom * delta));
        this.updateTransform();
      }
    }, { passive: false });

    // Property inputs - using input event for real-time updates
    this.setupPropertyListeners();
  }

  setupPropertyListeners() {
    // Artboard properties
    const abName = document.getElementById('prop-ab-name');
    const abWidth = document.getElementById('prop-ab-width');
    const abHeight = document.getElementById('prop-ab-height');
    const abBg = document.getElementById('prop-ab-bg');
    
    abName?.addEventListener('input', (e) => this.updateArtboard('name', e.target.value));
    abWidth?.addEventListener('input', (e) => this.updateArtboard('width', parseInt(e.target.value) || 0));
    abHeight?.addEventListener('input', (e) => this.updateArtboard('height', parseInt(e.target.value) || 0));
    abBg?.addEventListener('input', (e) => {
      this.updateArtboard('background', e.target.value);
      document.getElementById('prop-ab-bg-display').textContent = e.target.value;
    });

    // Element properties
    const elX = document.getElementById('prop-el-x');
    const elY = document.getElementById('prop-el-y');
    const elW = document.getElementById('prop-el-width');
    const elH = document.getElementById('prop-el-height');
    const elContent = document.getElementById('prop-el-content');
    const elFontSize = document.getElementById('prop-el-fontSize');
    const elColor = document.getElementById('prop-el-color');
    const elFill = document.getElementById('prop-el-fill');
    const elRadius = document.getElementById('prop-el-borderRadius');

    elX?.addEventListener('input', (e) => this.updateElement('x', parseInt(e.target.value) || 0));
    elY?.addEventListener('input', (e) => this.updateElement('y', parseInt(e.target.value) || 0));
    elW?.addEventListener('input', (e) => this.updateElement('width', parseInt(e.target.value) || 0));
    elH?.addEventListener('input', (e) => this.updateElement('height', parseInt(e.target.value) || 0));
    elContent?.addEventListener('input', (e) => this.updateElement('content', e.target.value));
    elFontSize?.addEventListener('input', (e) => this.updateElement('fontSize', parseInt(e.target.value) || 0));
    elColor?.addEventListener('input', (e) => this.updateElement('color', e.target.value));
    elFill?.addEventListener('input', (e) => this.updateElement('fill', e.target.value));
    elRadius?.addEventListener('input', (e) => this.updateElement('borderRadius', parseInt(e.target.value) || 0));

    // Buttons
    document.getElementById('exportPngBtn')?.addEventListener('click', () => this.exportPNG());
    document.getElementById('exportHtmlBtn')?.addEventListener('click', () => this.exportHTML());
    document.getElementById('deleteElementBtn')?.addEventListener('click', () => this.deleteSelectedElement());
  }

  startDrag(e, type, id) {
    this.isDragging = true;
    this.dragType = type;
    
    // Get mouse position relative to viewport
    const viewport = document.getElementById('canvasViewport');
    const rect = viewport.getBoundingClientRect();
    
    // Store initial positions
    this.dragStartMouseX = e.clientX;
    this.dragStartMouseY = e.clientY;
    
    if (type === 'element') {
      this.dragTarget = this.elements.find(el => el.id === id);
      this.dragStartX = this.dragTarget.x;
      this.dragStartY = this.dragTarget.y;
    } else if (type === 'artboard') {
      this.dragTarget = this.artboards.find(ab => ab.id === id);
      this.dragStartX = this.dragTarget.x;
      this.dragStartY = this.dragTarget.y;
    }
  }

  handleDrag(e) {
    if (!this.dragTarget) return;
    
    // Calculate delta in screen pixels
    const deltaX = (e.clientX - this.dragStartMouseX) / this.zoom;
    const deltaY = (e.clientY - this.dragStartMouseY) / this.zoom;
    
    // Apply delta to original position
    let newX = this.dragStartX + deltaX;
    let newY = this.dragStartY + deltaY;
    
    // Snap to grid
    newX = Math.round(newX / 10) * 10;
    newY = Math.round(newY / 10) * 10;
    
    // Update data
    this.dragTarget.x = newX;
    this.dragTarget.y = newY;
    
    // Update DOM directly
    if (this.dragType === 'element') {
      const el = document.querySelector(`[data-element-id="${this.dragTarget.id}"]`);
      if (el) {
        el.style.left = newX + 'px';
        el.style.top = newY + 'px';
      }
      // Update properties panel
      const xInput = document.getElementById('prop-el-x');
      const yInput = document.getElementById('prop-el-y');
      if (xInput) xInput.value = newX;
      if (yInput) yInput.value = newY;
    } else if (this.dragType === 'artboard') {
      const ab = document.querySelector(`[data-artboard-id="${this.dragTarget.id}"].artboard`);
      if (ab) {
        ab.style.left = newX + 'px';
        ab.style.top = newY + 'px';
      }
    }
  }

  endDrag() {
    this.isDragging = false;
    this.dragTarget = null;
  }

  selectElement(id) {
    this.selectedElementId = id;
    this.selectedArtboardId = null;
    this.render();
    this.setupPropertyListeners();
  }

  selectArtboard(id) {
    this.selectedArtboardId = id;
    this.selectedElementId = null;
    this.render();
    this.setupPropertyListeners();
  }

  deselectAll() {
    this.selectedElementId = null;
    this.render();
    this.setupPropertyListeners();
  }

  updateArtboard(key, value) {
    const ab = this.artboards.find(a => a.id === this.selectedArtboardId);
    if (!ab) return;
    ab[key] = value;
    this.render();
    this.setupPropertyListeners();
  }

  updateElement(key, value) {
    const el = this.elements.find(e => e.id === this.selectedElementId);
    if (!el) return;
    el[key] = value;
    
    // Update just the element in DOM
    const elNode = document.querySelector(`[data-element-id="${el.id}"]`);
    if (elNode) {
      if (key === 'x') elNode.style.left = value + 'px';
      if (key === 'y') elNode.style.top = value + 'px';
      if (key === 'width') elNode.style.width = value + 'px';
      if (key === 'height') elNode.style.height = value + 'px';
      if (key === 'content' && el.type === 'text') elNode.textContent = value;
      if (key === 'fontSize' && el.type === 'text') elNode.style.fontSize = value + 'px';
      if (key === 'color' && el.type === 'text') elNode.style.color = value;
      if (key === 'fill' && el.type === 'rect') elNode.style.background = value;
      if (key === 'borderRadius' && el.type === 'rect') elNode.style.borderRadius = value + 'px';
    }
  }

  deleteSelectedElement() {
    if (!this.selectedElementId) return;
    this.elements = this.elements.filter(e => e.id !== this.selectedElementId);
    this.selectedElementId = null;
    this.render();
    this.setupPropertyListeners();
    showToast('Element deleted', 'info');
  }

  addNewArtboard() {
    const id = 'ab' + Date.now();
    this.artboards.push({
      id, name: `Artboard ${this.artboards.length + 1}`,
      width: 300, height: 250,
      x: 100 + this.artboards.length * 50, y: 100 + this.artboards.length * 50,
      background: '#050505'
    });
    this.selectArtboard(id);
    showToast('New artboard added', 'success');
  }

  updateTransform() {
    const viewport = document.getElementById('canvasViewport');
    const zoomDisplay = document.getElementById('zoomLevel');
    if (viewport) viewport.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    if (zoomDisplay) zoomDisplay.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  togglePreview() {
    document.body.classList.toggle('preview-mode');
    const btn = document.getElementById('previewBtn');
    if (btn) btn.textContent = document.body.classList.contains('preview-mode') ? '⏹ Stop' : '▶ Preview';
  }

  exportPNG() {
    const ab = this.artboards.find(a => a.id === this.selectedArtboardId) || this.artboards[0];
    const canvas = document.createElement('canvas');
    canvas.width = ab.width; canvas.height = ab.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = ab.background;
    ctx.fillRect(0, 0, ab.width, ab.height);
    this.elements.filter(el => el.artboardId === ab.id).forEach(el => {
      if (el.type === 'rect') {
        ctx.fillStyle = el.fill;
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.width, el.height, el.borderRadius);
        ctx.fill();
      } else if (el.type === 'text') {
        ctx.fillStyle = el.color;
        ctx.font = `bold ${el.fontSize}px "Space Grotesk", sans-serif`;
        ctx.fillText(el.content, el.x, el.y + el.fontSize * 0.8);
      }
    });
    const link = document.createElement('a');
    link.download = `${ab.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    showToast('PNG exported!', 'success');
  }

  exportHTML() {
    const ab = this.artboards.find(a => a.id === this.selectedArtboardId) || this.artboards[0];
    const elementsHTML = this.elements.filter(el => el.artboardId === ab.id).map(el => {
      if (el.type === 'rect') return `    <div style="position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; background: ${el.fill}; border-radius: ${el.borderRadius}px;"></div>`;
      if (el.type === 'text') return `    <div style="position: absolute; left: ${el.x}px; top: ${el.y}px; font-family: 'Space Grotesk', sans-serif; font-size: ${el.fontSize}px; font-weight: 700; color: ${el.color};">${el.content}</div>`;
      return '';
    }).join('\n');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${ab.name}</title><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet"></head><body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a;"><div style="position: relative; width: ${ab.width}px; height: ${ab.height}px; background: ${ab.background}; overflow: hidden;">\n${elementsHTML}\n  </div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${ab.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    showToast('HTML exported!', 'success');
  }
}

let studio;
function initStudio() {
  const container = document.getElementById('studioContainer');
  if (container) studio = new Studio('studioContainer');
}
