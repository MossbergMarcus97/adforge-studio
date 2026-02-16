# AdForge Campaign Engine: Forge Implementation Spec
## Ready for Build — Priority Order

**Context:** Design is complete. Now Forge implements the components and functionality.

---

## IMPLEMENTATION ROADMAP

### 🔥 PHASE 1: Core Infrastructure (Week 1)
**Priority: CRITICAL — Foundation must be solid**

#### 1.1 Update Base Files
- [ ] Merge `styles-electric-midnight.css` + `styles-extensions.css` into single stylesheet
- [ ] Update `index.html` to import new styles
- [ ] Set up JavaScript module structure

#### 1.2 Component Library (Vanilla JS)
Create reusable components in `js/components/`:
- [ ] `Button.js` — All button variants with hover effects
- [ ] `Card.js` — Card component with glow variants
- [ ] `Input.js` — Text inputs, selects, floating labels
- [ ] `Modal.js` — Modal system with overlay
- [ ] `Toast.js` — Notification system
- [ ] `Spinner.js` — Loading states

#### 1.3 State Management
Create `js/store/`:
- [ ] `CampaignStore.js` — Central state for campaigns
- [ ] `AssetStore.js` — Asset management state
- [ ] `UserStore.js` — User/auth state

---

### 🔥 PHASE 2: Campaign Dashboard (Week 1-2)
**Priority: HIGH — This is the home view**

#### 2.1 Campaign Grid
```javascript
// components/CampaignGrid.js
class CampaignGrid {
  render() {
    // Grid of campaign cards
    // Filter bar
    // Search functionality
  }
}
```

#### 2.2 Campaign Card Component
- [ ] Status indicator (active/draft/paused/completed)
- [ ] Sparkline chart (use lightweight library like Chart.js or custom SVG)
- [ ] Metric pills (CTR, Spend, Clicks)
- [ ] Quick actions (edit, pause, duplicate)

#### 2.3 Filter & Search
- [ ] Filter by status, client, brand, date
- [ ] Search by campaign name
- [ ] Sort options

**Mock Data Needed:**
```javascript
const campaigns = [
  {
    id: 'camp_001',
    name: 'Q3 Enterprise Push',
    client: 'Northstar',
    brand: 'Northstar Cloud',
    status: 'active',
    budget: { spent: 12000, total: 15000 },
    metrics: { ctr: 4.2, clicks: 8500, conversions: 340 },
    sparklineData: [12, 15, 18, 22, 19, 25, 28],
    assets: 6,
    daysRemaining: 12
  }
];
```

---

### 🔥 PHASE 3: Creative Board (Week 2-3)
**Priority: HIGH — Core differentiator**

#### 3.1 Kanban Board
```javascript
// components/CreativeBoard.js
class CreativeBoard {
  columns = ['backlog', 'inProgress', 'review', 'approved', 'live', 'archived'];
  
  render() {
    // Horizontal scrollable board
    // Drop zones for each column
    // Creative cards
  }
}
```

#### 3.2 Drag & Drop
- [ ] HTML5 Drag and Drop API
- [ ] Visual feedback (lift, ghost image, drop zones)
- [ ] State updates on drop

#### 3.3 Creative Card
- [ ] Thumbnail preview
- [ ] Version badge
- [ ] Comment count
- [ ] Assignee avatar
- [ ] Hover overlay with actions

#### 3.4 Asset Upload
- [ ] Drag-drop upload zone
- [ ] Progress indicator
- [ ] Thumbnail generation

---

### 🔥 PHASE 4: Analytics Dashboard (Week 3-4)
**Priority: HIGH — Data visualization**

#### 4.1 KPI Header
- [ ] 4 metric cards with trend indicators
- [ ] Auto-refresh every 30s

#### 4.2 Main Chart
Use **Chart.js** or **ApexCharts**:
- [ ] Line chart with multiple metrics
- [ ] Date range selector
- [ ] Toggle metrics on/off
- [ ] Comparison mode

#### 4.3 Breakdown Cards
- [ ] Platform breakdown (pie/bar)
- [ ] Creative performance table
- [ ] Time heatmap

---

### PHASE 5: Asset Library (Week 4)
**Priority: MEDIUM — Important for workflow**

- [ ] Masonry grid layout
- [ ] Filter by type, tags
- [ ] Search functionality
- [ ] Asset detail panel
- [ ] Bulk operations

---

### PHASE 6: Collaboration (Week 5)
**Priority: MEDIUM — Team features**

- [ ] Activity feed component
- [ ] Comment threads
- [ ] @mentions
- [ ] Approval workflow states

---

### PHASE 7: A/B Testing (Week 5-6)
**Priority: MEDIUM — Advanced feature**

- [ ] Test setup wizard
- [ ] Variant comparison cards
- [ ] Confidence calculator
- [ ] Winner declaration

---

### PHASE 8: Polish (Week 6)
**Priority: LOW — But makes it shine**

- [ ] Animations (GSAP or Framer Motion via JS)
- [ ] Custom cursor
- [ ] Keyboard shortcuts
- [ ] Offline support (Service Worker)

---

## TECHNICAL REQUIREMENTS

### Dependencies to Add
```json
{
  "dependencies": {
    "chart.js": "^4.x",
    "date-fns": "^3.x",
    "uuid": "^9.x"
  }
}
```

### File Structure
```
adjacent-studio/
├── index.html
├── css/
│   ├── design-system.css (merged styles)
│   └── animations.css
├── js/
│   ├── app.js (entry point)
│   ├── components/
│   │   ├── CampaignGrid.js
│   │   ├── CreativeBoard.js
│   │   ├── AnalyticsDashboard.js
│   │   └── ...
│   ├── store/
│   │   ├── CampaignStore.js
│   │   └── AssetStore.js
│   └── utils/
│       ├── dom.js
│       ├── api.js
│       └── helpers.js
├── assets/
│   └── (images, fonts)
└── data/
    └── mock-data.json
```

---

## KEY IMPLEMENTATION NOTES

### 1. Keep It Vanilla
- No React/Vue/Angular
- Vanilla JS with Web Components or class-based components
- Easier to maintain, lighter weight

### 2. Modular CSS
- Use CSS custom properties (already defined)
- Component-based CSS organization
- Avoid specificity wars

### 3. State Management Pattern
```javascript
// Simple pub/sub state management
class Store {
  constructor() {
    this.state = {};
    this.listeners = [];
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
  }
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(fn => fn(this.state));
  }
}
```

### 4. Animation Strategy
- CSS animations for simple effects (hover, transitions)
- GSAP for complex sequences (scroll triggers, page transitions)
- `prefers-reduced-motion` support mandatory

### 5. Performance
- Lazy load components below the fold
- Virtualize long lists (campaign grid if 100+ items)
- Debounce search inputs
- Throttle scroll events

---

## ACCEPTANCE CRITERIA

### Phase 1 Complete When:
- [ ] All base components render correctly
- [ ] Styles match design spec exactly
- [ ] No console errors

### Phase 2 Complete When:
- [ ] Campaign grid displays 10+ campaigns
- [ ] Filters work (status, search)
- [ ] Sparklines render

### Phase 3 Complete When:
- [ ] Drag-drop works between columns
- [ ] Cards persist state
- [ ] Upload zone accepts files

### Phase 4 Complete When:
- [ ] Charts render with real-looking data
- [ ] Date range changes update charts
- [ ] KPI cards show trends

---

## QUESTIONS FOR ALFRED/CLIENT

1. **Real backend or mock data?** (Start with mock, API later?)
2. **User auth needed now?** (Skip for MVP, add later)
3. **Export formats priority?** (PDF reports, CSV data)
4. **Real-time collaboration?** (WebSockets or polling)

---

*Implementation spec by Alfred*  
*Ready for Forge execution*
