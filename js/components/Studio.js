// Studio — Creation-First Canvas Workspace (Production Ready)
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
    this.dragOffset = { x: 0, y: 0 };
    this.lastMouseX = 0;
    this.lastMouseY = 0;
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
    this.renderStructure();
    this.renderScenes();
    this.renderCanvas();
    this.renderProperties();
    this.attachEventListeners();
  }

  renderStructure() {
    this.container.innerHTML = `
      <div class="studio-layout">
        <div class="scenes-panel">
          <div class="panel-header">
            <h3>Scenes</h3>
            <button class="btn-icon" id="addArtboardBtn">+</button>
          </div>
          <div class="scenes-list" id="scenesList"></div>
        </div>
        <div class="canvas-area" id="canvasArea">
          <div class="canvas-viewport" id="canvasViewport">
            <div class="canvas-grid"></div>
            <div id="artboardsContainer"></div>
          </div>
          <div class="canvas-controls">
            <button class="control-btn" id="zoomOutBtn">−</button>
            <span class="zoom-level" id="zoomLevel">100%</span>
            <button class="control-btn" id="zoomInBtn">+</button>
            <button class="control-btn" id="resetViewBtn">⌘</button>
          </div>
        </div>
        <div class="properties-panel" id="propertiesPanel">
          <div class="panel-header"><h3>Properties</h3></div>
          <div id="propertiesContent"></div>
        </div>
      </div>
      <div class="studio-toolbar">
        <div class="tool-group">
          <button class="tool-btn active" data-tool="select">🖱️</button>
          <button class="tool-btn" data-tool="text">📝</button>
          <button class="tool-btn" data-tool="image">🖼️</button>
          <button class="tool-btn" data-tool="shape">🔷</button>
        </div>
        <div class="tool-divider"></div>
        <div class="tool-group">
          <button class="tool-btn">↶</button>
          <button class="tool-btn">↷</button>
        </div>
        <div class="tool-divider"></div>
        <div class="tool-group">
          <button class="tool-btn preview-btn" id="previewBtn">▶ Preview</button>
        </div>
      </div>
    `;
    this.updateViewportTransform();
  }

  renderScenes() {
    const container = document.getElementById('scenesList');
    if (!container) return;
    container.innerHTML = this.artboards.map(ab => `
      <div class="scene-item ${this.selectedArtboardId === ab.id ? 'active' : ''}" data-artboard-id="${ab.id}">
        <div class="scene-thumbnail" style="aspect-ratio: ${ab.width}/${ab.height}; background: ${ab.background};">
          <span style="font-size: 0.6rem; opacity: 0.5;">${ab.width}×${ab.height}</span>
        </div>
        <span class="scene-name">${ab.name}</span>
      </div>
    `).join('');
  }

  renderCanvas() {
    const container = document.getElementById('artboardsContainer');
    if (!container) return;
    container.innerHTML = this.artboards.map(ab => this.renderArtboard(ab)).join('');
  }

  renderArtboard(ab) {
    const isSelected = this.selectedArtboardId === ab.id;
    const artboardElements = this.elements.filter(el => el.artboardId === ab.id);
    return `
      <div class="artboard ${isSelected ? 'selected' : ''}" data-artboard-id="${ab.id}"
           style="left: ${ab.x}px; top: ${ab.y}px; width: ${ab.width}px; height: ${ab.height}px; background: ${ab.background};">
        <div class="artboard-header" data-drag="artboard" data-artboard-id="${ab.id}">
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
    const baseStyle = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;`;
    if (el.type === 'text') {
      return `<div class="canvas-element text-element ${isSelected ? 'selected' : ''}" data-element-id="${el.id}" data-drag="element" style="${baseStyle} color: ${el.color}; font-size: ${el.fontSize}px;">${el.content}</div>`;
    } else if (el.type === 'rect') {
      return `<div class="canvas-element shape-element ${isSelected ? 'selected' : ''}" data-element-id="${el.id}" data-drag="element" style="${baseStyle} background: ${el.fill}; border-radius: ${el.borderRadius}px;"></div>`;
    }
    return '';
  }

  renderProperties() {
    const container = document.getElementById('propertiesContent');
    if (!container) return;
    container.innerHTML = this.selectedElementId ? this.renderElementProperties() : this.renderArtboardProperties();
  }

  renderArtboardProperties() {
    const ab = this.getSelectedArtboard();
    if (!ab) return '<div class="properties-content"><p>No artboard selected</p></div>';
    return `
      <div class="properties-content">
        <div class="property-section">
          <h4>Artboard</h4>
          <div class="property-row">
            <label>Name</label>
            <input type="text" class="prop-input" data-prop="artboard" data-key="name" value="${ab.name}">
          </div>
          <div class="property-row cols-2">
            <div><label>Width</label><input type="number" class="prop-input" data-prop="artboard" data-key="width" value="${ab.width}"></div>
            <div><label>Height</label><input type="number" class="prop-input" data-prop="artboard" data-key="height" value="${ab.height}"></div>
          </div>
        </div>
        <div class="property-section">
          <h4>Background</h4>
          <div class="color-picker-row">
            <input type="color" data-prop="artboard" data-key="background" value="${ab.background}">
            <span>${ab.background}</span>
          </div>
        </div>
        <div class="property-section">
          <h4>Export</h4>
          <button class="btn-secondary" style="width: 100%;" id="exportPngBtn">Export PNG</button>
          <button class="btn-secondary" style="width: 100%; margin-top: 8px;" id="exportHtmlBtn">Export HTML</button>
        </div>
      </div>
    `;
  }

  renderElementProperties() {
    const el = this.getSelectedElement();
    if (!el) return '<div class="properties-content"><p>No element selected</p></div>';
    const commonProps = `
      <div class="property-section">
        <h4>Position & Size</h4>
        <div class="property-row cols-2">
          <div><label>X</label><input type="number" class="prop-input" data-prop="element" data-key="x" value="${Math.round(el.x)}"></div>
          <div><label>Y</label><input type="number" class="prop-input" data-prop="element" data-key="y" value="${Math.round(el.y)}"></div>
        </div>
        <div class="property-row cols-2">
          <div><label>Width</label><input type="number" class="prop-input" data-prop="element" data-key="width" value="${Math.round(el.width)}"></div>
          <div><label>Height</label><input type="number" class="prop-input" data-prop="element" data-key="height" value="${Math.round(el.height)}"></div>
        </div>
      </div>`;
    if (el.type === 'text') {
      return `
        <div class="properties-content">
          ${commonProps}
          <div class="property-section">
            <h4>Typography</h4>
            <div class="property-row"><label>Content</label><textarea class="prop-input" rows="2" data-prop="element" data-key="content">${el.content}</textarea></div>
            <div class="property-row"><label>Font Size</label><input type="number" class="prop-input" data-prop="element" data-key="fontSize" value="${el.fontSize}"></div>
            <div class="property-row"><label>Color</label><input type="color" data-prop="element" data-key="color" value="${el.color}"></div>
          </div>
          <div class="property-section"><button class="btn-danger" style="width: 100%;" id="deleteElementBtn">Delete Element</button></div>
        </div>`;
    } else {
      return `
        <div class="properties-content">
          ${commonProps}
          <div class="property-section">
            <h4>Appearance</h4>
            <div class="property-row"><label>Fill Color</label><input type="color" data-prop="element" data-key="fill" value="${el.fill}"></div>
            <div class="property-row"><label>Border Radius</label><input type="number" class="prop-input" data-prop="element" data-key="borderRadius" value="${el.borderRadius}"></div>
          </div>
          <div class="property-section"><button class="btn-danger" style="width: 100%;" id="deleteElementBtn">Delete Element</button></div>
        </div>`;
    }
  }

  attachEventListeners() {
    // Toolbar
    this.container.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTool = btn.dataset.tool;
      });
    });

    // Zoom
    document.getElementById('zoomInBtn')?.addEventListener('click', () => this.zoomIn());
    document.getElementById('zoomOutBtn')?.addEventListener('click', () => this.zoomOut());
    document.getElementById('resetViewBtn')?.addEventListener('click', () => this.resetView());
    document.getElementById('previewBtn')?.addEventListener('click', () => this.togglePreview());
    document.getElementById('addArtboardBtn')?.addEventListener('click', () => this.addNewArtboard());

    // Canvas interactions
    const canvasArea = document.getElementById('canvasArea');
    this.container.addEventListener('mousedown', (e) => {
      const dragEl = e.target.closest('[data-drag]');
      const elementEl = e.target.closest('[data-element-id]');
      const sceneEl = e.target.closest('.scene-item[data-artboard-id]');

      if (sceneEl) {
        e.preventDefault();
        this.selectArtboard(sceneEl.dataset.artboardId);
        return;
      }

      if (dragEl && this.activeTool === 'select') {
        e.preventDefault();
        e.stopPropagation();
        const dragType = dragEl.dataset.drag;
        if (dragType === 'element') {
          this.selectElement(dragEl.dataset.elementId);
          this.startDrag(e, 'element', dragEl.dataset.elementId);
        } else if (dragType === 'artboard') {
          const artboardId = dragEl.closest('.artboard').dataset.artboardId;
          this.selectArtboard(artboardId);
          this.startDrag(e, 'artboard', artboardId);
        }
        return;
      }

      if (elementEl && this.activeTool === 'select') {
        e.preventDefault();
        this.selectElement(elementEl.dataset.elementId);
        return;
      }

      if (e.target === canvasArea || e.target.classList.contains('canvas-grid')) {
        this.isPanning = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        canvasArea.style.cursor = 'grabbing';
        this.selectNone();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging && this.dragTarget) {
        e.preventDefault();
        this.handleDrag(e);
      } else if (this.isPanning) {
        this.panX += e.clientX - this.lastMouseX;
        this.panY += e.clientY - this.lastMouseY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.updateViewportTransform();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) this.endDrag();
      if (this.isPanning) {
        this.isPanning = false;
        canvasArea.style.cursor = 'default';
      }
    });

    canvasArea?.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom = Math.max(0.1, Math.min(3, this.zoom * delta));
        this.updateViewportTransform();
      }
    }, { passive: false });

    // Properties
    this.container.addEventListener('change', (e) => {
      if (e.target.dataset.prop === 'artboard') {
        this.updateArtboardProperty(e.target.dataset.key, e.target.value);
      } else if (e.target.dataset.prop === 'element') {
        this.updateElementProperty(e.target.dataset.key, e.target.value);
      }
    });

    this.container.addEventListener('click', (e) => {
      if (e.target.id === 'exportPngBtn') this.exportPNG();
      else if (e.target.id === 'exportHtmlBtn') this.exportHTML();
      else if (e.target.id === 'deleteElementBtn') this.deleteSelectedElement();
    });
  }

  startDrag(e, type, id) {
    this.isDragging = true;
    this.dragType = type;
    const canvasArea = document.getElementById('canvasArea');
    const rect = canvasArea.getBoundingClientRect();

    if (type === 'element') {
      this.dragTarget = this.elements.find(el => el.id === id);
      const elNode = document.querySelector(`[data-element-id="${id}"]`);
      const elRect = elNode.getBoundingClientRect();
      this.dragOffset = {
        x: (e.clientX - elRect.left) / this.zoom,
        y: (e.clientY - elRect.top) / this.zoom
      };
    } else if (type === 'artboard') {
      this.dragTarget = this.artboards.find(ab => ab.id === id);
      this.dragOffset = { x: 0, y: 0 };
    }
  }

  handleDrag(e) {
    const canvasArea = document.getElementById('canvasArea');
    const rect = canvasArea.getBoundingClientRect();
    const rawX = (e.clientX - rect.left - this.panX) / this.zoom - this.dragOffset.x;
    const rawY = (e.clientY - rect.top - this.panY) / this.zoom - this.dragOffset.y;
    const snappedX = Math.round(rawX / 10) * 10;
    const snappedY = Math.round(rawY / 10) * 10;

    this.dragTarget.x = snappedX;
    this.dragTarget.y = snappedY;

    if (this.dragType === 'element') {
      const elNode = document.querySelector(`[data-element-id="${this.dragTarget.id}"]`);
      if (elNode) {
        elNode.style.left = snappedX + 'px';
        elNode.style.top = snappedY + 'px';
      }
    } else if (this.dragType === 'artboard') {
      const abNode = document.querySelector(`[data-artboard-id="${this.dragTarget.id}"].artboard`);
      if (abNode) {
        abNode.style.left = snappedX + 'px';
        abNode.style.top = snappedY + 'px';
      }
    }

    // Update properties panel
    const xInput = document.querySelector('[data-prop="element"][data-key="x"]');
    const yInput = document.querySelector('[data-prop="element"][data-key="y"]');
    if (xInput) xInput.value = snappedX;
    if (yInput) yInput.value = snappedY;
  }

  endDrag() {
    this.isDragging = false;
    this.dragTarget = null;
    this.dragType = null;
    this.renderProperties();
  }

  selectElement(elementId) {
    document.querySelectorAll('.canvas-element.selected').forEach(el => el.classList.remove('selected'));
    this.selectedElementId = elementId;
    this.selectedArtboardId = null;
    const elNode = document.querySelector(`[data-element-id="${elementId}"]`);
    if (elNode) elNode.classList.add('selected');
    this.renderScenes();
    this.renderProperties();
  }

  selectArtboard(artboardId) {
    document.querySelectorAll('.artboard.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.scene-item.active').forEach(el => el.classList.remove('active'));
    this.selectedArtboardId = artboardId;
    this.selectedElementId = null;
    const abNode = document.querySelector(`[data-artboard-id="${artboardId}"].artboard`);
    if (abNode) abNode.classList.add('selected');
    const sceneNode = document.querySelector(`.scene-item[data-artboard-id="${artboardId}"]`);
    if (sceneNode) sceneNode.classList.add('active');
    this.renderProperties();
  }

  selectNone() {
    this.selectedElementId = null;
    document.querySelectorAll('.canvas-element.selected, .artboard.selected').forEach(el => el.classList.remove('selected'));
    this.renderProperties();
  }

  updateArtboardProperty(key, value) {
    const ab = this.getSelectedArtboard();
    if (!ab) return;
    ab[key] = (key === 'width' || key === 'height') ? (parseInt(value) || 0) : value;
    this.renderCanvas();
    this.renderScenes();
    showToast(`${key} updated`, 'success');
  }

  updateElementProperty(key, value) {
    const el = this.getSelectedElement();
    if (!el) return;
    el[key] = ['x', 'y', 'width', 'height', 'fontSize', 'borderRadius'].includes(key) ? (parseInt(value) || 0) : value;
    this.renderCanvas();
    showToast(`${key} updated`, 'success');
  }

  deleteSelectedElement() {
    if (!this.selectedElementId) return;
    this.elements = this.elements.filter(el => el.id !== this.selectedElementId);
    this.selectedElementId = null;
    this.renderCanvas();
    this.renderProperties();
    showToast('Element deleted', 'info');
  }

  addNewArtboard() {
    const id = `ab${Date.now()}`;
    const newAb = {
      id, name: `Artboard ${this.artboards.length + 1}`,
      width: 300, height: 250,
      x: 100 + this.artboards.length * 50, y: 100 + this.artboards.length * 50,
      background: '#050505'
    };
    this.artboards.push(newAb);
    this.selectArtboard(id);
    this.renderCanvas();
    this.renderScenes();
    showToast('New artboard added', 'success');
  }

  zoomIn() { this.zoom = Math.min(3, this.zoom * 1.2); this.updateViewportTransform(); }
  zoomOut() { this.zoom = Math.max(0.1, this.zoom / 1.2); this.updateViewportTransform(); }
  resetView() { this.zoom = 1; this.panX = 0; this.panY = 0; this.updateViewportTransform(); }

  updateViewportTransform() {
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
    const ab = this.getSelectedArtboard();
    if (!ab) { showToast('No artboard selected', 'error'); return; }
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
    const ab = this.getSelectedArtboard();
    if (!ab) { showToast('No artboard selected', 'error'); return; }
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

  getSelectedArtboard() { return this.artboards.find(ab => ab.id === this.selectedArtboardId); }
  getSelectedElement() { return this.elements.find(el => el.id === this.selectedElementId); }
}

let studio;
function initStudio() {
  const container = document.getElementById('studioContainer');
  if (container) studio = new Studio('studioContainer');
}
