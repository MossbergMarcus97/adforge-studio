// AdForge Studio — Agent-Friendly Ad Design Canvas
// Architecture: Serializable state, clear APIs, AI-operable
// Version: 1.0.0

class Studio {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.view = { zoom: 1, panX: 0, panY: 0 };
    this.interaction = { isPanning: false, isDragging: false, dragTarget: null, dragType: null, dragStartX: 0, dragStartY: 0, dragStartMouseX: 0, dragStartMouseY: 0, activeTool: 'select' };
    this.selection = { elementId: null, artboardId: 'ab1' };
    this.history = { stack: [], index: -1, maxSize: 50 };
    this.document = this.getDefaultDocument();
    this.init();
  }
  
  getDefaultDocument() {
    return {
      version: '1.0.0', created: new Date().toISOString(), modified: new Date().toISOString(),
      artboards: [
        { id: 'ab1', name: 'Banner 300x250', width: 300, height: 250, x: 100, y: 100, background: '#050505', visible: true },
        { id: 'ab2', name: 'Social 1080x1080', width: 1080, height: 1080, x: 500, y: 50, background: '#050505', visible: true }
      ],
      elements: [
        { id: 'el1', artboardId: 'ab1', type: 'text', x: 20, y: 30, width: 260, height: 40, content: 'Launch Fast', fontSize: 24, color: '#ffffff', visible: true },
        { id: 'el2', artboardId: 'ab1', type: 'rect', x: 20, y: 180, width: 120, height: 40, fill: '#00f0ff', borderRadius: 20, visible: true }
      ],
      metadata: { title: 'Untitled Project', description: '', tags: [] }
    };
  }
  
  // Agent API
  exportDocument() { return JSON.stringify(this.document, null, 2); }
  importDocument(json) { try { const parsed = JSON.parse(json); if (parsed.version && parsed.artboards && parsed.elements) { this.saveState(); this.document = parsed; this.document.modified = new Date().toISOString(); this.render(); return { success: true }; } return { success: false, error: 'Invalid format' }; } catch (e) { return { success: false, error: e.message }; } }
  createElement(config) { const id = `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; const element = { id, artboardId: config.artboardId || this.selection.artboardId, type: config.type || 'rect', x: config.x || 0, y: config.y || 0, width: config.width || 100, height: config.height || 100, visible: true, ...config }; this.saveState(); this.document.elements.push(element); this.document.modified = new Date().toISOString(); this.selectElement(id); return element; }
  getStats() { return { artboards: this.document.artboards.length, elements: this.document.elements.length, selectedArtboard: this.selection.artboardId, selectedElement: this.selection.elementId, zoom: this.view.zoom }; }

  init() { this.saveState(); this.render(); }
  saveState() { if (this.history.index < this.history.stack.length - 1) this.history.stack = this.history.stack.slice(0, this.history.index + 1); this.history.stack.push(JSON.stringify(this.document)); if (this.history.stack.length > this.history.maxSize) this.history.stack.shift(); else this.history.index++; }
  undo() { if (this.history.index > 0) { this.history.index--; this.document = JSON.parse(this.history.stack[this.history.index]); this.render(); showToast('Undo', 'info'); return true; } showToast('Nothing to undo', 'info'); return false; }
  redo() { if (this.history.index < this.history.stack.length - 1) { this.history.index++; this.document = JSON.parse(this.history.stack[this.history.index]); this.render(); showToast('Redo', 'info'); return true; } showToast('Nothing to redo', 'info'); return false; }

  render() {
    this.container.innerHTML = `
      <div class="studio-layout">
        <div class="scenes-panel"><div class="panel-header"><h3>Scenes</h3><button class="btn-icon" id="addArtboardBtn">+</button></div><div class="scenes-list">${this.document.artboards.map(ab => this.renderSceneItem(ab)).join('')}</div></div>
        <div class="canvas-area" id="canvasArea">
          <div class="canvas-viewport" id="canvasViewport" style="transform: translate(${this.view.panX}px, ${this.view.panY}px) scale(${this.view.zoom});"><div class="canvas-grid"></div>${this.document.artboards.map(ab => this.renderArtboard(ab)).join('')}</div>
          <div class="canvas-controls"><button class="control-btn" id="zoomOutBtn">−</button><span class="zoom-level">${Math.round(this.view.zoom * 100)}%</span><button class="control-btn" id="zoomInBtn">+</button><button class="control-btn" id="resetViewBtn">⌘</button></div>
        </div>
        <div class="properties-panel"><div class="panel-header"><h3>Properties</h3>${this.selection.elementId ? '<button class="btn-icon" id="deleteElBtn">🗑</button>' : ''}</div><div class="properties-content">${this.selection.elementId ? this.renderElementProperties() : this.renderArtboardProperties()}</div></div>
      </div>
      <div class="studio-toolbar">
        <div class="tool-group"><button class="tool-btn ${this.interaction.activeTool === 'select' ? 'active' : ''}" data-tool="select">🖱️</button><button class="tool-btn ${this.interaction.activeTool === 'text' ? 'active' : ''}" data-tool="text">📝</button><button class="tool-btn ${this.interaction.activeTool === 'rect' ? 'active' : ''}" data-tool="rect">⬜</button><button class="tool-btn ${this.interaction.activeTool === 'circle' ? 'active' : ''}" data-tool="circle">⭕</button></div>
        <div class="tool-divider"></div>
        <div class="tool-group"><button class="tool-btn" id="undoBtn">↶</button><button class="tool-btn" id="redoBtn">↷</button></div>
        <div class="tool-divider"></div>
        <div class="tool-group"><button class="tool-btn" id="saveBtn">💾</button><button class="tool-btn" id="loadBtn">📂</button></div>
        <div class="tool-divider"></div>
        <div class="tool-group"><button class="tool-btn preview-btn" id="previewBtn">▶ Preview</button></div>
      </div>
    `;
    this.attachEventListeners();
  }

  renderSceneItem(ab) { return `<div class="scene-item ${this.selection.artboardId === ab.id ? 'active' : ''}" data-artboard-id="${ab.id}"><div class="scene-thumbnail" style="aspect-ratio: ${ab.width}/${ab.height}; background: ${ab.background};"><span style="font-size: 0.6rem; opacity: 0.5;">${ab.width}x${ab.height}</span></div><span class="scene-name">${ab.name}</span></div>`; }
  renderArtboard(ab) { const elements = this.document.elements.filter(el => el.artboardId === ab.id && el.visible); return `<div class="artboard ${this.selection.artboardId === ab.id ? 'selected' : ''}" data-artboard-id="${ab.id}" style="left: ${ab.x}px; top: ${ab.y}px; width: ${ab.width}px; height: ${ab.height}px; background: ${ab.background};"><div class="artboard-header" data-draggable="artboard"><span class="artboard-name">${ab.name}</span><span class="artboard-dims">${ab.width} x ${ab.height}</span></div><div class="artboard-content">${elements.map(el => this.renderElement(el)).join('')}</div></div>`; }
  renderElement(el) { const isSelected = this.selection.elementId === el.id; const style = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;`; switch(el.type) { case 'text': return `<div class="canvas-element text-element ${isSelected ? 'selected' : ''}" data-element-id="${el.id}" data-draggable="element" style="${style} color: ${el.color}; font-size: ${el.fontSize}px;">${el.content}</div>`; case 'rect': return `<div class="canvas-element shape-element ${isSelected ? 'selected' : ''}" data-element-id="${el.id}" data-draggable="element" style="${style} background: ${el.fill}; border-radius: ${el.borderRadius}px;"></div>`; case 'circle': return `<div class="canvas-element shape-element ${isSelected ? 'selected' : ''}" data-element-id="${el.id}" data-draggable="element" style="${style} background: ${el.fill}; border-radius: 50%;"></div>`; default: return ''; } }
  renderArtboardProperties() { const ab = this.document.artboards.find(a => a.id === this.selection.artboardId) || this.document.artboards[0]; return `<div class="property-section"><h4>Artboard</h4><div class="property-row"><label>Name</label><input type="text" class="prop-input" id="prop-ab-name" value="${ab.name}"></div><div class="property-row cols-2"><div><label>Width</label><input type="number" class="prop-input" id="prop-ab-width" value="${ab.width}"></div><div><label>Height</label><input type="number" class="prop-input" id="prop-ab-height" value="${ab.height}"></div></div></div><div class="property-section"><h4>Background</h4><div class="color-picker-row"><input type="color" id="prop-ab-bg" value="${ab.background}"><span>${ab.background}</span></div></div><div class="property-section"><h4>Export</h4><button class="btn-secondary" id="exportPngBtn">Export PNG</button><button class="btn-secondary" id="exportHtmlBtn" style="margin-top: 8px;">Export HTML</button><button class="btn-secondary" id="exportJsonBtn" style="margin-top: 8px;">Export JSON</button></div>`; }
  renderElementProperties() { const el = this.document.elements.find(e => e.id === this.selection.elementId); if (!el) return this.renderArtboardProperties(); const common = `<div class="property-section"><h4>Position & Size</h4><div class="property-row cols-2"><div><label>X</label><input type="number" class="prop-input" id="prop-el-x" value="${Math.round(el.x)}"></div><div><label>Y</label><input type="number" class="prop-input" id="prop-el-y" value="${Math.round(el.y)}"></div></div><div class="property-row cols-2"><div><label>Width</label><input type="number" class="prop-input" id="prop-el-width" value="${Math.round(el.width)}"></div><div><label>Height</label><input type="number" class="prop-input" id="prop-el-height" value="${Math.round(el.height)}"></div></div></div>`; if (el.type === 'text') { return common + `<div class="property-section"><h4>Typography</h4><div class="property-row"><label>Content</label><textarea class="prop-input" id="prop-el-content" rows="2">${el.content}</textarea></div><div class="property-row"><label>Font Size</label><input type="number" class="prop-input" id="prop-el-fontSize" value="${el.fontSize}"></div><div class="property-row"><label>Color</label><input type="color" id="prop-el-color" value="${el.color}"></div></div>`; } else { return common + `<div class="property-section"><h4>Appearance</h4><div class="property-row"><label>Fill Color</label><input type="color" id="prop-el-fill" value="${el.fill}"></div>${el.type === 'rect' ? `<div class="property-row"><label>Border Radius</label><input type="number" class="prop-input" id="prop-el-radius" value="${el.borderRadius || 0}"></div>` : ''}</div>`; } }

  attachEventListeners() {
    this.container.querySelectorAll('.tool-btn[data-tool]').forEach(btn => btn.addEventListener('click', () => this.setTool(btn.dataset.tool)));
    document.getElementById('zoomInBtn')?.addEventListener('click', () => { this.view.zoom *= 1.2; this.updateTransform(); });
    document.getElementById('zoomOutBtn')?.addEventListener('click', () => { this.view.zoom /= 1.2; this.updateTransform(); });
    document.getElementById('resetViewBtn')?.addEventListener('click', () => { this.view.zoom = 1; this.view.panX = 0; this.view.panY = 0; this.updateTransform(); });
    document.getElementById('previewBtn')?.addEventListener('click', () => this.togglePreview());
    document.getElementById('addArtboardBtn')?.addEventListener('click', () => this.addArtboard());
    document.getElementById('undoBtn')?.addEventListener('click', () => this.undo());
    document.getElementById('redoBtn')?.addEventListener('click', () => this.redo());
    document.getElementById('saveBtn')?.addEventListener('click', () => this.saveToFile());
    document.getElementById('loadBtn')?.addEventListener('click', () => this.loadFromFile());
    
    const canvasArea = document.getElementById('canvasArea');
    this.container.addEventListener('mousedown', (e) => {
      const draggable = e.target.closest('[data-draggable]');
      const element = e.target.closest('[data-element-id]');
      const sceneItem = e.target.closest('.scene-item[data-artboard-id]');
      const artboard = e.target.closest('.artboard');
      
      if (sceneItem) { e.preventDefault(); this.selectArtboard(sceneItem.dataset.artboardId); return; }
      if (element && !draggable) { e.stopPropagation(); this.selectElement(element.dataset.elementId); return; }
      
      if (draggable) {
        e.preventDefault(); e.stopPropagation();
        const type = draggable.dataset.draggable;
        if (type === 'element') this.startDrag(e, 'element', draggable.dataset.elementId);
        else if (type === 'artboard') { const abId = draggable.closest('.artboard').dataset.artboardId; this.selectArtboard(abId); this.startDrag(e, 'artboard', abId); }
        return;
      }
      
      if (e.target === canvasArea || e.target.classList.contains('canvas-grid')) {
        this.interaction.isPanning = true;
        this.interaction.dragStartMouseX = e.clientX - this.view.panX;
        this.interaction.dragStartMouseY = e.clientY - this.view.panY;
        canvasArea.style.cursor = 'grabbing';
        this.deselectAll();
      }
      
      if (artboard && this.interaction.activeTool !== 'select') {
        const rect = artboard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.view.zoom;
        const y = (e.clientY - rect.top) / this.view.zoom;
        this.createElementAt(x, y, artboard.dataset.artboardId);
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.interaction.isDragging) this.handleDrag(e);
      else if (this.interaction.isPanning) { this.view.panX = e.clientX - this.interaction.dragStartMouseX; this.view.panY = e.clientY - this.interaction.dragStartMouseY; this.updateTransform(); }
    });
    
    document.addEventListener('mouseup', () => {
      if (this.interaction.isDragging) this.endDrag();
      if (this.interaction.isPanning) { this.interaction.isPanning = false; canvasArea.style.cursor = 'default'; }
    });
    
    canvasArea?.addEventListener('wheel', (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); this.view.zoom = Math.max(0.1, Math.min(3, this.view.zoom * (e.deltaY > 0 ? 0.9 : 1.1))); this.updateTransform(); } }, { passive: false });
    
    this.attachPropertyListeners();
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }
  
  attachPropertyListeners() {
    const ab = this.document.artboards.find(a => a.id === this.selection.artboardId) || this.document.artboards[0];
    document.getElementById('prop-ab-name')?.addEventListener('input', (e) => { ab.name = e.target.value; this.renderScenes(); });
    document.getElementById('prop-ab-width')?.addEventListener('input', (e) => { ab.width = parseInt(e.target.value) || 0; this.renderCanvas(); });
    document.getElementById('prop-ab-height')?.addEventListener('input', (e) => { ab.height = parseInt(e.target.value) || 0; this.renderCanvas(); });
    document.getElementById('prop-ab-bg')?.addEventListener('input', (e) => { ab.background = e.target.value; this.renderCanvas(); });
    
    const el = this.document.elements.find(e => e.id === this.selection.elementId);
    if (el) {
      document.getElementById('prop-el-x')?.addEventListener('input', (e) => this.updateElementVisual(el, 'x', parseInt(e.target.value) || 0));
      document.getElementById('prop-el-y')?.addEventListener('input', (e) => this.updateElementVisual(el, 'y', parseInt(e.target.value) || 0));
      document.getElementById('prop-el-width')?.addEventListener('input', (e) => this.updateElementVisual(el, 'width', parseInt(e.target.value) || 0));
      document.getElementById('prop-el-height')?.addEventListener('input', (e) => this.updateElementVisual(el, 'height', parseInt(e.target.value) || 0));
      document.getElementById('prop-el-content')?.addEventListener('input', (e) => this.updateElementVisual(el, 'content', e.target.value));
      document.getElementById('prop-el-fontSize')?.addEventListener('input', (e) => this.updateElementVisual(el, 'fontSize', parseInt(e.target.value) || 0));
      document.getElementById('prop-el-color')?.addEventListener('input', (e) => this.updateElementVisual(el, 'color', e.target.value));
      document.getElementById('prop-el-fill')?.addEventListener('input', (e) => this.updateElementVisual(el, 'fill', e.target.value));
      document.getElementById('prop-el-radius')?.addEventListener('input', (e) => this.updateElementVisual(el, 'borderRadius', parseInt(e.target.value) || 0));
    }
    
    document.getElementById('exportPngBtn')?.addEventListener('click', () => this.exportPNG());
    document.getElementById('exportHtmlBtn')?.addEventListener('click', () => this.exportHTML());
    document.getElementById('exportJsonBtn')?.addEventListener('click', () => this.exportJSON());
    document.getElementById('deleteElBtn')?.addEventListener('click', () => this.deleteSelectedElement());
  }
  
  updateElementVisual(el, key, value) {
    el[key] = value;
    const elNode = document.querySelector(`[data-element-id="${el.id}"]`);
    if (!elNode) return;
    if (key === 'x') elNode.style.left = value + 'px';
    if (key === 'y') elNode.style.top = value + 'px';
    if (key === 'width') elNode.style.width = value + 'px';
    if (key === 'height') elNode.style.height = value + 'px';
    if (key === 'content' && el.type === 'text') elNode.textContent = value;
    if (key === 'fontSize' && el.type === 'text') elNode.style.fontSize = value + 'px';
    if (key === 'color' && el.type === 'text') elNode.style.color = value;
    if (key === 'fill') elNode.style.background = value;
    if (key === 'borderRadius' && el.type === 'rect') elNode.style.borderRadius = value + 'px';
  }
  
  handleKeyDown(e) {
    if (e.target.matches('input, textarea')) return;
    switch(e.key.toLowerCase()) {
      case 'v': this.setTool('select'); break;
      case 't': this.setTool('text'); break;
      case 'r': this.setTool('rect'); break;
      case 'c': this.setTool('circle'); break;
      case 'z': if (e.metaKey || e.ctrlKey) { e.preventDefault(); e.shiftKey ? this.redo() : this.undo(); } break;
      case 'delete': case 'backspace': if (this.selection.elementId) this.deleteSelectedElement(); break;
      case ' ': e.preventDefault(); this.togglePreview(); break;
    }
  }
  
  setTool(tool) {
    this.interaction.activeTool = tool;
    this.container.querySelectorAll('.tool-btn[data-tool]').forEach(btn => btn.classList.toggle('active', btn.dataset.tool === tool));
    const messages = { select: 'Select tool', text: 'Click artboard to add text', rect: 'Click artboard to add rectangle', circle: 'Click artboard to add circle' };
    showToast(messages[tool] || tool, 'info');
  }
  
  createElementAt(x, y, artboardId) {
    this.saveState();
    const config = { artboardId, x: Math.round(x / 10) * 10, y: Math.round(y / 10) * 10 };
    switch(this.interaction.activeTool) {
      case 'text': config.type = 'text'; config.width = 200; config.height = 40; config.content = 'New Text'; config.fontSize = 24; config.color = '#ffffff'; break;
      case 'rect': config.type = 'rect'; config.width = 120; config.height = 80; config.fill = '#00f0ff'; config.borderRadius = 0; break;
      case 'circle': config.type = 'circle'; config.width = 100; config.height = 100; config.fill = '#ff006e'; break;
      default: return;
    }
    this.createElement(config);
    this.setTool('select');
  }
  
  startDrag(e, type, id) {
    this.interaction.isDragging = true;
    this.interaction.dragType = type;
    if (type === 'element') { this.interaction.dragTarget = this.document.elements.find(el => el.id === id); this.selectElement(id); }
    else if (type === 'artboard') { this.interaction.dragTarget = this.document.artboards.find(ab => ab.id === id); }
    this.interaction.dragStartX = this.interaction.dragTarget.x;
    this.interaction.dragStartY = this.interaction.dragTarget.y;
    this.interaction.dragStartMouseX = e.clientX;
    this.interaction.dragStartMouseY = e.clientY;
    this.saveState();
  }
  
  handleDrag(e) {
    if (!this.interaction.dragTarget) return;
    const deltaX = (e.clientX - this.interaction.dragStartMouseX) / this.view.zoom;
    const deltaY = (e.clientY - this.interaction.dragStartMouseY) / this.view.zoom;
    const newX = Math.round((this.interaction.dragStartX + deltaX) / 10) * 10;
    const newY = Math.round((this.interaction.dragStartY + deltaY) / 10) * 10;
    this.interaction.dragTarget.x = newX;
    this.interaction.dragTarget.y = newY;
    if (this.interaction.dragType === 'element') {
      const el = document.querySelector(`[data-element-id="${this.interaction.dragTarget.id}"]`);
      if (el) { el.style.left = newX + 'px'; el.style.top = newY + 'px'; }
      const xInput = document.getElementById('prop-el-x');
      const yInput = document.getElementById('prop-el-y');
      if (xInput) xInput.value = newX;
      if (yInput) yInput.value = newY;
    } else {
      const ab = document.querySelector(`[data-artboard-id="${this.interaction.dragTarget.id}"].artboard`);
      if (ab) { ab.style.left = newX + 'px'; ab.style.top = newY + 'px'; }
    }
  }
  
  endDrag() { this.interaction.isDragging = false; this.interaction.dragTarget = null; }
  selectElement(id) { this.selection.elementId = id; this.selection.artboardId = null; this.render(); }
  selectArtboard(id) { this.selection.artboardId = id; this.selection.elementId = null; this.render(); }
  deselectAll() { this.selection.elementId = null; this.render(); }
  deleteSelectedElement() { if (!this.selection.elementId) return; this.saveState(); this.document.elements = this.document.elements.filter(e => e.id !== this.selection.elementId); this.selection.elementId = null; this.render(); showToast('Element deleted', 'info'); }
  
  addArtboard() {
    this.saveState();
    const id = 'ab_' + Date.now();
    this.document.artboards.push({ id, name: `Artboard ${this.document.artboards.length + 1}`, width: 300, height: 250, x: 100 + this.document.artboards.length * 50, y: 100 + this.document.artboards.length * 50, background: '#050505', visible: true });
    this.selectArtboard(id);
    showToast('New artboard added', 'success');
  }
  
  updateTransform() {
    const viewport = document.getElementById('canvasViewport');
    if (viewport) viewport.style.transform = `translate(${this.view.panX}px, ${this.view.panY}px) scale(${this.view.zoom})`;
  }
  
  togglePreview() {
    document.body.classList.toggle('preview-mode');
    const btn = document.getElementById('previewBtn');
    if (btn) btn.textContent = document.body.classList.contains('preview-mode') ? '⏹ Stop' : '▶ Preview';
  }
  
  renderScenes() { const container = this.container.querySelector('.scenes-list'); if (container) container.innerHTML = this.document.artboards.map(ab => this.renderSceneItem(ab)).join(''); }
  renderCanvas() { const container = this.container.querySelector('.canvas-viewport'); if (container) { const grid = container.querySelector('.canvas-grid'); container.innerHTML = (grid ? grid.outerHTML : '<div class="canvas-grid"></div>') + this.document.artboards.map(ab => this.renderArtboard(ab)).join(''); } }
  
  saveToFile() {
    const blob = new Blob([this.exportDocument()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${this.document.metadata.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Saved to file', 'success');
  }
  
  loadFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = this.importDocument(event.target.result);
        if (result.success) showToast('File loaded', 'success');
        else showToast('Error: ' + result.error, 'error');
      };
      reader.readAsText(file);
    };
    input.click();
  }
  
  exportPNG() {
    const ab = this.document.artboards.find(a => a.id === this.selection.artboardId) || this.document.artboards[0];
    const canvas = document.createElement('canvas');
    canvas.width = ab.width; canvas.height = ab.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = ab.background;
    ctx.fillRect(0, 0, ab.width, ab.height);
    this.document.elements.filter(el => el.artboardId === ab.id).forEach(el => {
      if (el.type === 'rect' || el.type === 'circle') {
        ctx.fillStyle = el.fill;
        ctx.beginPath();
        if (el.type === 'circle') ctx.arc(el.x + el.width/2, el.y + el.height/2, el.width/2, 0, Math.PI * 2);
        else ctx.roundRect(el.x, el.y, el.width, el.height, el.borderRadius || 0);
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
    const ab = this.document.artboards.find(a => a.id === this.selection.artboardId) || this.document.artboards[0];
    const elementsHTML = this.document.elements.filter(el => el.artboardId === ab.id).map(el => {
      if (el.type === 'rect') return `    <div style="position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; background: ${el.fill}; border-radius: ${el.borderRadius || 0}px;"></div>`;
      if (el.type === 'circle') return `    <div style="position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; background: ${el.fill}; border-radius: 50%;"></div>`;
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
  
  exportJSON() {
    const blob = new Blob([this.exportDocument()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${this.document.metadata.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    showToast('JSON exported!', 'success');
  }
}

let studio;
function initStudio() { const container = document.getElementById('studioContainer'); if (container) studio = new Studio('studioContainer'); }
