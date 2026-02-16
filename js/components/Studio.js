// Studio — Creation-First Canvas Workspace (Fixed)
class Studio {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.isDragging = false;
    this.dragElement = null;
    this.dragOffset = { x: 0, y: 0 };
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.activeTool = 'select';
    this.selectedElement = null;
    this.selectedArtboard = null;
    this.artboards = [
      { id: 'ab1', name: 'Banner 300×250', width: 300, height: 250, x: 100, y: 100, background: '#050505' },
      { id: 'ab2', name: 'Social 1080×1080', width: 1080, height: 1080, x: 500, y: 50, scale: 0.3, background: '#050505' }
    ];
    this.elements = [
      { id: 'el1', artboardId: 'ab1', type: 'text', x: 20, y: 20, width: 260, height: 40, content: 'Launch Fast', fontSize: 24, color: '#ffffff' },
      { id: 'el2', artboardId: 'ab1', type: 'rect', x: 20, y: 180, width: 120, height: 40, fill: '#00f0ff', borderRadius: 20 }
    ];
    this.init();
  }

  init() {
    this.render();
    this.attachGlobalEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="studio-layout">
        <!-- Left: Scenes Panel -->
        <div class="scenes-panel">
          <div class="panel-header">
            <h3>Scenes</h3>
            <button class="btn-icon" onclick="studio.addNewArtboard()">+</button>
          </div>
          <div class="scenes-list">
            ${this.artboards.map((ab, index) => `
              <div class="scene-item ${this.selectedArtboard?.id === ab.id ? 'active' : ''}" data-id="${ab.id}" onclick="studio.selectArtboard('${ab.id}')">
                <div class="scene-thumbnail" style="aspect-ratio: ${ab.width}/${ab.height}; background: ${ab.background};">
                  <span style="font-size: 0.6rem; opacity: 0.5;">${ab.width}×${ab.height}</span>
                </div>
                <span class="scene-name">${ab.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Center: Canvas -->
        <div class="canvas-area" id="canvasArea">
          <div class="canvas-viewport" id="canvasViewport"
               style="transform: translate(${this.panX}px, ${this.panY}px) scale(${this.zoom});">
            <div class="canvas-grid"></div>
            ${this.artboards.map(ab => this.renderArtboard(ab)).join('')}
          </div>

          <!-- Canvas Controls -->
          <div class="canvas-controls">
            <button class="control-btn" onclick="studio.zoomOut()">−</button>
            <span class="zoom-level">${Math.round(this.zoom * 100)}%</span>
            <button class="control-btn" onclick="studio.zoomIn()">+</button>
            <button class="control-btn" onclick="studio.resetView()" title="Fit to screen">⌘</button>
          </div>
        </div>

        <!-- Right: Properties Panel -->
        <div class="properties-panel" id="propertiesPanel">
          <div class="panel-header">
            <h3>Properties</h3>
          </div>
          ${this.selectedElement ? this.renderElementProperties() : this.renderArtboardProperties()}
        </div>
      </div>

      <!-- Bottom: Toolbar -->
      <div class="studio-toolbar">
        <div class="tool-group">
          <button class="tool-btn ${this.activeTool === 'select' ? 'active' : ''}" data-tool="select" onclick="studio.setTool('select')" title="Select (V)">
            🖱️
          </button>
          <button class="tool-btn ${this.activeTool === 'text' ? 'active' : ''}" data-tool="text" onclick="studio.setTool('text')" title="Text (T)">
            📝
          </button>
          <button class="tool-btn ${this.activeTool === 'image' ? 'active' : ''}" data-tool="image" onclick="studio.setTool('image')" title="Image (I)">
            🖼️
          </button>
          <button class="tool-btn ${this.activeTool === 'shape' ? 'active' : ''}" data-tool="shape" onclick="studio.setTool('shape')" title="Shape (R)">
            🔷
          </button>
        </div>

        <div class="tool-divider"></div>

        <div class="tool-group">
          <button class="tool-btn" onclick="studio.undo()" title="Undo (⌘Z)">↶</button>
          <button class="tool-btn" onclick="studio.redo()" title="Redo (⌘⇧Z)">↷</button>
        </div>

        <div class="tool-divider"></div>

        <div class="tool-group">
          <button class="tool-btn preview-btn" onclick="studio.togglePreview()" title="Preview (Space)">
            ▶ Preview
          </button>
        </div>
      </div>
    `;

    // Attach element-specific listeners after render
    this.attachElementListeners();
    this.attachPropertyListeners();
  }

  renderArtboard(ab) {
    const artboardElements = this.elements.filter(el => el.artboardId === ab.id);
    const isSelected = this.selectedArtboard?.id === ab.id;

    return `
      <div class="artboard ${isSelected ? 'selected' : ''}" data-id="${ab.id}"
           style="left: ${ab.x}px; top: ${ab.y}px; width: ${ab.width}px; height: ${ab.height}px; background: ${ab.background};">
        <div class="artboard-header" onmousedown="studio.startArtboardDrag(event, '${ab.id}')">
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
    const baseStyle = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;`;
    const isSelected = this.selectedElement?.id === el.id;

    if (el.type === 'text') {
      return `
        <div class="canvas-element text-element ${isSelected ? 'selected' : ''}"
             data-id="${el.id}" style="${baseStyle} color: ${el.color}; font-size: ${el.fontSize}px;"
             onmousedown="studio.startElementDrag(event, '${el.id}')">
          ${el.content}
        </div>
      `;
    } else if (el.type === 'rect') {
      return `
        <div class="canvas-element shape-element ${isSelected ? 'selected' : ''}"
             data-id="${el.id}"
             style="${baseStyle} background: ${el.fill}; border-radius: ${el.borderRadius}px;"
             onmousedown="studio.startElementDrag(event, '${el.id}')">
        </div>
      `;
    }

    return `<div class="canvas-element ${isSelected ? 'selected' : ''}" data-id="${el.id}" style="${baseStyle}"
             onmousedown="studio.startElementDrag(event, '${el.id}')"></div>`;
  }

  renderArtboardProperties() {
    const ab = this.selectedArtboard || this.artboards[0];

    return `
      <div class="properties-content">
        <div class="property-section">
          <h4>Artboard</h4>
          <div class="property-row">
            <label>Name</label>
            <input type="text" class="prop-input" id="prop-ab-name" value="${ab.name}" onchange="studio.updateArtboard('name', this.value)">
          </div>
          <div class="property-row cols-2">
            <div>
              <label>Width</label>
              <input type="number" class="prop-input" id="prop-ab-width" value="${ab.width}" onchange="studio.updateArtboard('width', parseInt(this.value))">
            </div>
            <div>
              <label>Height</label>
              <input type="number" class="prop-input" id="prop-ab-height" value="${ab.height}" onchange="studio.updateArtboard('height', parseInt(this.value))">
            </div>
          </div>
        </div>

        <div class="property-section">
          <h4>Background</h4>
          <div class="color-picker-row">
            <input type="color" id="prop-ab-bg" value="${ab.background}" onchange="studio.updateArtboard('background', this.value)">
            <span id="prop-ab-bg-val">${ab.background}</span>
          </div>
          <div class="property-row">
            <label>Image</label>
            <button class="btn-ghost" onclick="showToast('Image upload coming soon!', 'info')">Choose...</button>
          </div>
        </div>

        <div class="property-section">
          <h4>Export</h4>
          <button class="btn-secondary" style="width: 100%;" onclick="studio.exportPNG()">Export PNG</button>
          <button class="btn-secondary" style="width: 100%; margin-top: 8px;" onclick="studio.exportHTML()">Export HTML</button>
        </div>
      </div>
    `;
  }

  renderElementProperties() {
    const el = this.selectedElement;

    return `
      <div class="properties-content">
        <div class="property-section">
          <h4>${el.type === 'text' ? 'Text' : 'Shape'}</h4>
          <div class="property-row cols-2">
            <div>
              <label>X</label>
              <input type="number" class="prop-input" value="${Math.round(el.x)}" onchange="studio.updateElement('x', parseInt(this.value))">
            </div>
            <div>
              <label>Y</label>
              <input type="number" class="prop-input" value="${Math.round(el.y)}" onchange="studio.updateElement('y', parseInt(this.value))">
            </div>
          </div>
          <div class="property-row cols-2">
            <div>
              <label>Width</label>
              <input type="number" class="prop-input" value="${Math.round(el.width)}" onchange="studio.updateElement('width', parseInt(this.value))">
            </div>
            <div>
              <label>Height</label>
              <input type="number" class="prop-input" value="${Math.round(el.height)}" onchange="studio.updateElement('height', parseInt(this.value))">
            </div>
          </div>
        </div>

        ${el.type === 'text' ? `
        <div class="property-section">
          <h4>Typography</h4>
          <div class="property-row">
            <label>Content</label>
            <textarea class="prop-input" rows="2" onchange="studio.updateElement('content', this.value)">${el.content}</textarea>
          </div>
          <div class="property-row">
            <label>Size</label>
            <input type="range" min="12" max="72" value="${el.fontSize}" class="prop-slider" oninput="studio.updateElement('fontSize', parseInt(this.value)); this.nextElementSibling.textContent = this.value + 'px'">
            <span>${el.fontSize}px</span>
          </div>
          <div class="property-row">
            <label>Color</label>
            <input type="color" value="${el.color}" onchange="studio.updateElement('color', this.value)">
          </div>
        </div>
        ` : `
        <div class="property-section">
          <h4>Fill</h4>
          <div class="color-picker-row">
            <input type="color" value="${el.fill}" onchange="studio.updateElement('fill', this.value); this.nextElementSibling.textContent = this.value">">
            <span>${el.fill}</span>
          </div>
        </div>
        <div class="property-section">
          <h4>Radius</h4>
          <input type="range" min="0" max="50" value="${el.borderRadius}" class="prop-slider" oninput="studio.updateElement('borderRadius', parseInt(this.value)); this.nextElementSibling.textContent = this.value + 'px'">
          <span>${el.borderRadius}px</span>
        </div>
        `}

        <div class="property-section">
          <button class="btn-danger" style="width: 100%;" onclick="studio.deleteElement()">Delete</button>
        </div>
      </div>
    `;
  }

  // ============ DRAG & DROP ============

  startElementDrag(e, elementId) {
    if (this.activeTool !== 'select') return;
    e.stopPropagation();

    this.selectElement(elementId);
    this.isDragging = true;
    this.dragElement = this.elements.find(el => el.id === elementId);

    // Calculate offset from element's top-left
    const rect = e.target.getBoundingClientRect();
    this.dragOffset = {
      x: (e.clientX - rect.left) / this.zoom,
      y: (e.clientY - rect.top) / this.zoom
    };

    e.target.style.cursor = 'grabbing';
  }

  startArtboardDrag(e, artboardId) {
    if (this.activeTool !== 'select') return;
    e.stopPropagation();

    this.selectArtboard(artboardId);
    this.isDragging = true;
    this.dragElement = this.artboards.find(ab => ab.id === artboardId);
    this.dragOffset = { x: 0, y: 0 };
  }

  onMouseMove(e) {
    if (this.isDragging && this.dragElement) {
      const canvasArea = document.getElementById('canvasArea');
      const rect = canvasArea.getBoundingClientRect();

      // Calculate position relative to canvas, accounting for zoom and pan
      const x = (e.clientX - rect.left - this.panX) / this.zoom - this.dragOffset.x;
      const y = (e.clientY - rect.top - this.panY) / this.zoom - this.dragOffset.y;

      // Snap to grid (10px)
      const snappedX = Math.round(x / 10) * 10;
      const snappedY = Math.round(y / 10) * 10;

      this.dragElement.x = snappedX;
      this.dragElement.y = snappedY;

      // Re-render to show new position
      this.render();
    }

    if (this.isPanning) {
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.panX += dx;
      this.panY += dy;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      const viewport = document.getElementById('canvasViewport');
      if (viewport) {
        viewport.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
      }
    }
  }

  onMouseUp() {
    this.isDragging = false;
    this.dragElement = null;
    this.isPanning = false;

    const canvasArea = document.getElementById('canvasArea');
    if (canvasArea) {
      canvasArea.style.cursor = 'default';
    }
  }

  // ============ SELECTION ============

  selectElement(elementId) {
    this.selectedElement = this.elements.find(el => el.id === elementId);
    this.selectedArtboard = null;
    this.render();
  }

  selectArtboard(artboardId) {
    this.selectedArtboard = this.artboards.find(ab => ab.id === artboardId);
    this.selectedElement = null;
    this.render();
  }

  // ============ UPDATES ============

  updateElement(property, value) {
    if (this.selectedElement) {
      this.selectedElement[property] = value;
      this.render();
    }
  }

  updateArtboard(property, value) {
    const ab = this.selectedArtboard || this.artboards[0];
    ab[property] = value;
    this.render();
    showToast(`${property} updated`, 'success');
  }

  deleteElement() {
    if (this.selectedElement) {
      this.elements = this.elements.filter(el => el.id !== this.selectedElement.id);
      this.selectedElement = null;
      this.render();
      showToast('Element deleted', 'info');
    }
  }

  // ============ TOOLS ============

  setTool(tool) {
    this.activeTool = tool;
    this.render();

    // If text tool, add new text on next click
    if (tool === 'text') {
      showToast('Click on artboard to add text', 'info');
    } else if (tool === 'shape') {
      showToast('Click on artboard to add shape', 'info');
    }
  }

  // ============ EXPORT ============

  exportPNG() {
    showToast('Exporting PNG...', 'info');
    // Create a temporary canvas to render the artboard
    const ab = this.selectedArtboard || this.artboards[0];
    const canvas = document.createElement('canvas');
    canvas.width = ab.width;
    canvas.height = ab.height;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = ab.background;
    ctx.fillRect(0, 0, ab.width, ab.height);

    // Draw elements
    const abElements = this.elements.filter(el => el.artboardId === ab.id);
    abElements.forEach(el => {
      if (el.type === 'rect') {
        ctx.fillStyle = el.fill;
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.width, el.height, el.borderRadius);
        ctx.fill();
      } else if (el.type === 'text') {
        ctx.fillStyle = el.color;
        ctx.font = `bold ${el.fontSize}px "Space Grotesk", sans-serif`;
        ctx.fillText(el.content, el.x, el.y + el.fontSize);
      }
    });

    // Download
    const link = document.createElement('a');
    link.download = `${ab.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    showToast('PNG exported!', 'success');
  }

  exportHTML() {
    const ab = this.selectedArtboard || this.artboards[0];
    const abElements = this.elements.filter(el => el.artboardId === ab.id);

    let elementsHTML = abElements.map(el => {
      if (el.type === 'rect') {
        return `    <div style="position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; background: ${el.fill}; border-radius: ${el.borderRadius}px;"></div>`;
      } else if (el.type === 'text') {
        return `    <div style="position: absolute; left: ${el.x}px; top: ${el.y}px; font-family: 'Space Grotesk', sans-serif; font-size: ${el.fontSize}px; font-weight: 700; color: ${el.color};">${el.content}</div>`;
      }
      return '';
    }).join('\n');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${ab.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a;">
  <div style="position: relative; width: ${ab.width}px; height: ${ab.height}px; background: ${ab.background}; overflow: hidden;">
${elementsHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${ab.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    showToast('HTML exported!', 'success');
  }

  // ============ ARTBOARD MANAGEMENT ============

  addNewArtboard() {
    const id = `ab${this.artboards.length + 1}`;
    this.artboards.push({
      id,
      name: `Artboard ${this.artboards.length + 1}`,
      width: 300,
      height: 250,
      x: 100 + this.artboards.length * 50,
      y: 100 + this.artboards.length * 50,
      background: '#050505'
    });
    this.render();
    showToast('New artboard added', 'success');
  }

  // ============ ZOOM & PAN ============

  zoomIn() {
    this.zoom = Math.min(3, this.zoom * 1.2);
    this.updateZoom();
  }

  zoomOut() {
    this.zoom = Math.max(0.1, this.zoom / 1.2);
    this.updateZoom();
  }

  resetView() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateZoom();
  }

  updateZoom() {
    const viewport = document.getElementById('canvasViewport');
    const display = document.querySelector('.zoom-level');

    if (viewport) {
      viewport.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    }
    if (display) {
      display.textContent = `${Math.round(this.zoom * 100)}%`;
    }
  }

  togglePreview() {
    document.body.classList.toggle('preview-mode');
    const btn = document.querySelector('.preview-btn');
    if (btn) {
      btn.textContent = document.body.classList.contains('preview-mode') ? '⏹ Stop' : '▶ Preview';
    }
  }

  // ============ EVENT LISTENERS ============

  attachGlobalEventListeners() {
    // Global mouse events for dragging
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', () => this.onMouseUp());

    // Canvas pan start
    const canvasArea = document.getElementById('canvasArea');
    if (canvasArea) {
      canvasArea.addEventListener('mousedown', (e) => {
        // Only pan if clicking on canvas background (not elements)
        if (e.target === canvasArea || e.target.classList.contains('canvas-grid') || e.target.classList.contains('artboard-content')) {
          this.isPanning = true;
          this.lastMouseX = e.clientX;
          this.lastMouseY = e.clientY;
          canvasArea.style.cursor = 'grabbing';
          // Deselect when clicking canvas
          this.selectedElement = null;
          this.selectedArtboard = null;
          this.render();
        }
      });

      // Zoom with wheel
      canvasArea.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? 0.9 : 1.1;
          this.zoom = Math.max(0.1, Math.min(3, this.zoom * delta));
          this.updateZoom();
        }
      }, { passive: false });
    }
  }

  attachElementListeners() {
    // Element click/selection is handled via inline onmousedown
  }

  attachPropertyListeners() {
    // Property changes are handled via inline onchange
  }

  // ============ UNDO/REDO (placeholders) ============

  undo() {
    showToast('Undo coming soon!', 'info');
  }

  redo() {
    showToast('Redo coming soon!', 'info');
  }
}

// Global instance
let studio;

function initStudio() {
  const container = document.getElementById('studioContainer');
  if (container) {
    studio = new Studio('studioContainer');
  }
}
