const STORAGE_KEY = "adforge-design-os-v3";
const LEGACY_KEYS = ["adforge-adjacent-kit-v2", "adforge-adjacent-kit-v1"];

const MAX_LOGOS = 16;
const MAX_IMAGES = 28;
const MAX_UPLOADED_FONTS = 24;

const STEPS = ["setup", "brand", "message", "creative", "launch"];
const STEP_HINTS = {
  setup: "Define client, brand, and campaign architecture.",
  brand: "Build the reusable identity system and assets.",
  message: "Translate strategy into messaging architecture.",
  creative: "Scale and track creatives across status lanes.",
  launch: "Validate readiness and export handoff artifacts."
};

const BASE_FONT_OPTIONS = [
  "Space Grotesk",
  "IBM Plex Sans",
  "Manrope",
  "Archivo",
  "Fraunces",
  "Public Sans",
  "Playfair Display",
  "Sora",
  "Inter",
  "DM Sans"
];

const SERIF_FONTS = new Set(["Fraunces", "Playfair Display", "Libre Baskerville", "Merriweather"]);
const FONT_FILE_EXTENSIONS = ["ttf", "otf", "woff", "woff2"];
const FONT_FORMATS = ["truetype", "opentype", "woff", "woff2"];

const CREATIVE_FORMATS = ["Static", "Carousel", "Short Video", "Story", "Landing Hero", "Email", "UGC Script"];
const CREATIVE_STATUSES = ["Draft", "In Review", "Approved", "Live"];
const MESSAGING_CHANNELS = ["LinkedIn", "Meta", "YouTube", "Display", "Email", "TikTok"];

const PALETTE_PRESETS = [
  {
    name: "Command Blue",
    colors: ["#081B43", "#1368F4", "#18C9A3", "#F58D4F", "#FEF4E2", "#101826"]
  },
  {
    name: "Meridian Bright",
    colors: ["#10253F", "#2E7BFF", "#6EDCFF", "#FDBB52", "#FFF7E8", "#13263E"]
  },
  {
    name: "Editorial Warm",
    colors: ["#2D1F18", "#E97043", "#F7B267", "#FFECD1", "#3EC1A1", "#111827"]
  },
  {
    name: "Nordic Tech",
    colors: ["#0B1E32", "#00A2FF", "#2BD5A2", "#FF8E72", "#F3F7FF", "#101A2A"]
  },
  {
    name: "Signal Green",
    colors: ["#072A2A", "#0B7A75", "#14C4A2", "#F4A259", "#FFF4E6", "#0C1D2B"]
  },
  {
    name: "Launch Ember",
    colors: ["#20171A", "#FF5E5B", "#FFA552", "#FFE8CC", "#31D0AA", "#0E2238"]
  }
];

const DEMO_BRAND_PATCH = {
  name: "AdForge Signal",
  tagline: "Deploy campaign systems with premium creative consistency.",
  voice: ["Decisive", "Human", "Proof-led"],
  palette: ["#071F45", "#1E6EFF", "#1BCDA4", "#F59B5D", "#FFF3DE", "#111827"],
  headingFont: "Archivo",
  bodyFont: "IBM Plex Sans",
  accentFont: "Fraunces",
  typeScale: 108,
  radius: 24,
  gradientAngle: 130,
  overlayDensity: 52,
  layoutStyle: "split",
  imageryFilter: "vivid"
};

const DEMO_CAMPAIGN_PATCH = {
  name: "Q3 Pipeline Accelerator",
  objective: "Increase enterprise SQL pipeline from paid channels",
  audience: "VP Marketing and demand generation leaders",
  channel: "LinkedIn, Meta, YouTube",
  message: "Unify brand strategy and campaign execution in one operating system.",
  proofPoints: ["CTR +38%", "CAC -24%", "Creative cycle -52%"],
  cta: "Book a strategy workshop",
  tone: "Specific, calm confidence, conversion-focused"
};

const DEFAULT_BRAND_TEMPLATE = {
  name: "AdForge Labs",
  tagline: "Creative systems for performance teams.",
  voice: ["Confident", "Modern", "Evidence-led"],
  palette: ["#081B43", "#1368F4", "#18C9A3", "#F58D4F", "#FEF4E2", "#101826"],
  headingFont: "Space Grotesk",
  bodyFont: "IBM Plex Sans",
  accentFont: "Fraunces",
  typeScale: 102,
  radius: 20,
  gradientAngle: 130,
  overlayDensity: 45,
  layoutStyle: "split",
  imageryFilter: "none",
  fgIndex: 5,
  bgIndex: 4,
  logos: [],
  imagery: [],
  primaryLogoId: null,
  heroImageId: null
};

const DEFAULT_CAMPAIGN_TEMPLATE = {
  name: "Launch Sprint",
  objective: "Drive qualified pipeline",
  audience: "Growth leaders at B2B SaaS",
  channel: "LinkedIn, Meta",
  message: "Go from strategy to launch-ready creative with consistency.",
  proofPoints: ["CTR +38%", "CAC -24%", "Creative velocity +2.1x"],
  cta: "Generate launch concepts",
  tone: "Direct, premium, no hype",
  messageAngles: [
    {
      segment: "Demand-gen teams",
      angle: "Creative velocity without chaos",
      offer: "Concept-to-launch workflows"
    },
    {
      segment: "CMO / VP Marketing",
      angle: "Revenue-focused creative system",
      offer: "Performance reporting clarity"
    }
  ],
  creatives: [
    {
      title: "Proof Stack Carousel",
      format: "Carousel",
      status: "Draft",
      hook: "Move from brief to live ads in days, not weeks."
    },
    {
      title: "Founder UGC Story",
      format: "UGC Script",
      status: "In Review",
      hook: "Show before/after campaign execution in 30 seconds."
    }
  ]
};

const runtimeUploadedFontFaces = new Map();

const state = createInitialState();

const el = {
  globalClientSelect: document.getElementById("globalClientSelect"),
  globalBrandSelect: document.getElementById("globalBrandSelect"),
  globalCampaignSelect: document.getElementById("globalCampaignSelect"),
  quickAddClientBtn: document.getElementById("quickAddClientBtn"),
  quickAddBrandBtn: document.getElementById("quickAddBrandBtn"),
  quickAddCampaignBtn: document.getElementById("quickAddCampaignBtn"),
  loadDemoBtn: document.getElementById("loadDemoBtn"),

  journeyNav: document.getElementById("journeyNav"),
  journeyProgressLabel: document.getElementById("journeyProgressLabel"),
  journeyProgressFill: document.getElementById("journeyProgressFill"),
  journeyHint: document.getElementById("journeyHint"),
  workspaceContext: document.getElementById("workspaceContext"),

  setupClientNameInput: document.getElementById("setupClientNameInput"),
  setupBrandNameInput: document.getElementById("setupBrandNameInput"),
  setupCampaignNameInput: document.getElementById("setupCampaignNameInput"),
  addClientBtn: document.getElementById("addClientBtn"),
  deleteClientBtn: document.getElementById("deleteClientBtn"),
  addBrandBtn: document.getElementById("addBrandBtn"),
  cloneBrandBtn: document.getElementById("cloneBrandBtn"),
  deleteBrandBtn: document.getElementById("deleteBrandBtn"),
  addCampaignBtn: document.getElementById("addCampaignBtn"),
  duplicateCampaignBtn: document.getElementById("duplicateCampaignBtn"),
  deleteCampaignBtn: document.getElementById("deleteCampaignBtn"),
  portfolioSummary: document.getElementById("portfolioSummary"),

  brandNameInput: document.getElementById("brandNameInput"),
  taglineInput: document.getElementById("taglineInput"),
  voiceInput: document.getElementById("voiceInput"),
  layoutStyleSelect: document.getElementById("layoutStyleSelect"),
  radiusInput: document.getElementById("radiusInput"),
  gradientAngleInput: document.getElementById("gradientAngleInput"),
  overlayDensityInput: document.getElementById("overlayDensityInput"),
  headingFontSelect: document.getElementById("headingFontSelect"),
  bodyFontSelect: document.getElementById("bodyFontSelect"),
  accentFontSelect: document.getElementById("accentFontSelect"),
  googleFontInput: document.getElementById("googleFontInput"),
  addGoogleFontBtn: document.getElementById("addGoogleFontBtn"),
  fontUploadInput: document.getElementById("fontUploadInput"),
  customFontList: document.getElementById("customFontList"),
  typeScaleInput: document.getElementById("typeScaleInput"),
  radiusValue: document.getElementById("radiusValue"),
  angleValue: document.getElementById("angleValue"),
  overlayValue: document.getElementById("overlayValue"),
  scaleValue: document.getElementById("scaleValue"),
  typePreview: document.getElementById("typePreview"),

  logoUploadInput: document.getElementById("logoUploadInput"),
  imageryUploadInput: document.getElementById("imageryUploadInput"),
  logoGrid: document.getElementById("logoGrid"),
  imageryGrid: document.getElementById("imageryGrid"),
  imageryFilterSelect: document.getElementById("imageryFilterSelect"),

  palettePresetList: document.getElementById("palettePresetList"),
  addColorBtn: document.getElementById("addColorBtn"),
  paletteEditor: document.getElementById("paletteEditor"),
  fgColorSelect: document.getElementById("fgColorSelect"),
  bgColorSelect: document.getElementById("bgColorSelect"),
  contrastResult: document.getElementById("contrastResult"),

  campaignObjectiveInput: document.getElementById("campaignObjectiveInput"),
  campaignAudienceInput: document.getElementById("campaignAudienceInput"),
  campaignChannelInput: document.getElementById("campaignChannelInput"),
  campaignMessageInput: document.getElementById("campaignMessageInput"),
  campaignProofInput: document.getElementById("campaignProofInput"),
  campaignCtaInput: document.getElementById("campaignCtaInput"),
  campaignToneInput: document.getElementById("campaignToneInput"),
  addMessageAngleBtn: document.getElementById("addMessageAngleBtn"),
  messageAngleList: document.getElementById("messageAngleList"),

  addCreativeBtn: document.getElementById("addCreativeBtn"),
  generateCreativePackBtn: document.getElementById("generateCreativePackBtn"),
  creativeBoard: document.getElementById("creativeBoard"),

  launchChecklist: document.getElementById("launchChecklist"),
  campaignBriefPreview: document.getElementById("campaignBriefPreview"),
  copyBriefBtn: document.getElementById("copyBriefBtn"),
  copyCssBtn: document.getElementById("copyCssBtn"),
  exportCssBtn: document.getElementById("exportCssBtn"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  importJsonBtn: document.getElementById("importJsonBtn"),
  importJsonInput: document.getElementById("importJsonInput"),
  cssPreview: document.getElementById("cssPreview"),

  previewStage: document.getElementById("previewStage"),
  previewHeroImage: document.getElementById("previewHeroImage"),
  previewLogoSlot: document.getElementById("previewLogoSlot"),
  voiceChipList: document.getElementById("voiceChipList"),
  previewHeadline: document.getElementById("previewHeadline"),
  previewTagline: document.getElementById("previewTagline"),
  previewCtaBtn: document.getElementById("previewCtaBtn"),
  mockTitle: document.getElementById("mockTitle"),
  mockBody: document.getElementById("mockBody"),

  healthMetrics: document.getElementById("healthMetrics"),
  statusMessage: document.getElementById("statusMessage")
};

init();

async function init() {
  bindEvents();
  await hydrateFontLibrary();
  renderAll({ syncInputs: true });
  setStatus("Mission Control loaded. Start with Account Architecture and move through each phase.");
}

function bindEvents() {
  bindJourneyEvents();
  bindWorkspaceEvents();
  bindSetupEvents();
  bindBrandEvents();
  bindMessagingEvents();
  bindCreativeEvents();
  bindLaunchEvents();
}

function bindJourneyEvents() {
  el.journeyNav.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-step]");
    if (!button) return;

    const step = button.dataset.step;
    if (!STEPS.includes(step)) return;

    state.activeStep = step;
    renderJourney();
    renderStepVisibility();
    persistState();
  });
}

function bindWorkspaceEvents() {
  el.globalClientSelect.addEventListener("change", () => {
    state.activeClientId = el.globalClientSelect.value;
    coerceHierarchy(state);
    renderAll({ syncInputs: true });
    persistState();
  });

  el.globalBrandSelect.addEventListener("change", () => {
    state.activeBrandId = el.globalBrandSelect.value;
    coerceHierarchy(state);
    renderAll({ syncInputs: true });
    persistState();
  });

  el.globalCampaignSelect.addEventListener("change", () => {
    state.activeCampaignId = el.globalCampaignSelect.value;
    coerceHierarchy(state);
    renderAll({ syncInputs: true });
    persistState();
  });

  el.quickAddClientBtn.addEventListener("click", () => addClient());
  el.quickAddBrandBtn.addEventListener("click", () => addBrand());
  el.quickAddCampaignBtn.addEventListener("click", () => addCampaign());

  el.loadDemoBtn.addEventListener("click", () => {
    applyDemoStack();
    renderAll({ syncInputs: true });
    persistState();
    setStatus("Demo stack applied to current brand and campaign.");
  });
}

function bindSetupEvents() {
  el.setupClientNameInput.addEventListener("input", () => {
    const client = getActiveClient();
    if (!client) return;
    client.name = sanitizeText(el.setupClientNameInput.value, 80, "Untitled Client");
    renderWorkspaceSelectors();
    renderPortfolioSummary();
    persistState();
  });

  el.setupBrandNameInput.addEventListener("input", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.name = sanitizeText(el.setupBrandNameInput.value, 80, "Untitled Brand");
    renderWorkspaceSelectors();
    renderPortfolioSummary();
    refreshPreview();
    persistState();
  });

  el.setupCampaignNameInput.addEventListener("input", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.name = sanitizeText(el.setupCampaignNameInput.value, 90, "Untitled Campaign");
    renderWorkspaceSelectors();
    renderPortfolioSummary();
    refreshPreview();
    persistState();
  });

  el.addClientBtn.addEventListener("click", () => addClient());
  el.deleteClientBtn.addEventListener("click", () => deleteClient());
  el.addBrandBtn.addEventListener("click", () => addBrand());
  el.cloneBrandBtn.addEventListener("click", () => cloneBrand());
  el.deleteBrandBtn.addEventListener("click", () => deleteBrand());
  el.addCampaignBtn.addEventListener("click", () => addCampaign());
  el.duplicateCampaignBtn.addEventListener("click", () => duplicateCampaign());
  el.deleteCampaignBtn.addEventListener("click", () => deleteCampaign());
}

function bindBrandEvents() {
  el.brandNameInput.addEventListener("input", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.name = sanitizeText(el.brandNameInput.value, 80, DEFAULT_BRAND_TEMPLATE.name);
    el.setupBrandNameInput.value = brand.name;
    renderWorkspaceSelectors();
    renderPortfolioSummary();
    refreshPreview();
    persistState();
  });

  el.taglineInput.addEventListener("input", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.tagline = sanitizeText(el.taglineInput.value, 120, DEFAULT_BRAND_TEMPLATE.tagline);
    refreshPreview();
    persistState();
  });

  el.voiceInput.addEventListener("input", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.voice = parseVoice(el.voiceInput.value);
    refreshPreview();
    persistState();
  });

  el.layoutStyleSelect.addEventListener("change", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.layoutStyle = readAllowed(el.layoutStyleSelect.value, ["split", "poster", "focus"], "split");
    refreshPreview();
    persistState();
  });

  el.radiusInput.addEventListener("input", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.radius = clampInt(el.radiusInput.value, 8, 40, DEFAULT_BRAND_TEMPLATE.radius);
    refreshPreview();
    renderLaunchPack();
    persistState();
  });

  el.gradientAngleInput.addEventListener("input", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.gradientAngle = clampInt(el.gradientAngleInput.value, 0, 360, DEFAULT_BRAND_TEMPLATE.gradientAngle);
    refreshPreview();
    persistState();
  });

  el.overlayDensityInput.addEventListener("input", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.overlayDensity = clampInt(el.overlayDensityInput.value, 0, 90, DEFAULT_BRAND_TEMPLATE.overlayDensity);
    refreshPreview();
    persistState();
  });

  const onSelectFont = (field, selectElement, fallback) => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand[field] = sanitizeFontFamily(selectElement.value, fallback);
    refreshPreview();
    renderTypePreview();
    renderLaunchPack();
    persistState();
  };

  el.headingFontSelect.addEventListener("change", () => onSelectFont("headingFont", el.headingFontSelect, DEFAULT_BRAND_TEMPLATE.headingFont));
  el.bodyFontSelect.addEventListener("change", () => onSelectFont("bodyFont", el.bodyFontSelect, DEFAULT_BRAND_TEMPLATE.bodyFont));
  el.accentFontSelect.addEventListener("change", () => onSelectFont("accentFont", el.accentFontSelect, DEFAULT_BRAND_TEMPLATE.accentFont));

  el.typeScaleInput.addEventListener("input", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.typeScale = clampInt(el.typeScaleInput.value, 84, 136, DEFAULT_BRAND_TEMPLATE.typeScale);
    refreshPreview();
    renderTypePreview();
    renderLaunchPack();
    persistState();
  });

  el.logoUploadInput.addEventListener("change", async (event) => {
    await appendAssetsFromFiles(event.target.files, "logos", MAX_LOGOS);
    event.target.value = "";
  });

  el.imageryUploadInput.addEventListener("change", async (event) => {
    await appendAssetsFromFiles(event.target.files, "imagery", MAX_IMAGES);
    event.target.value = "";
  });

  el.logoGrid.addEventListener("click", (event) => {
    const brand = getActiveBrand();
    if (!brand) return;

    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "primary") {
      brand.primaryLogoId = id;
      renderLogoGrid();
      refreshPreview();
      persistState();
      return;
    }

    if (action === "remove") {
      brand.logos = brand.logos.filter((item) => item.id !== id);
      if (!brand.logos.some((item) => item.id === brand.primaryLogoId)) {
        brand.primaryLogoId = brand.logos[0] ? brand.logos[0].id : null;
      }
      renderLogoGrid();
      refreshPreview();
      persistState();
    }
  });

  el.imageryGrid.addEventListener("click", (event) => {
    const brand = getActiveBrand();
    if (!brand) return;

    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "hero") {
      brand.heroImageId = id;
      renderImageryGrid();
      refreshPreview();
      persistState();
      return;
    }

    if (action === "remove") {
      brand.imagery = brand.imagery.filter((item) => item.id !== id);
      if (!brand.imagery.some((item) => item.id === brand.heroImageId)) {
        brand.heroImageId = brand.imagery[0] ? brand.imagery[0].id : null;
      }
      renderImageryGrid();
      refreshPreview();
      persistState();
    }
  });

  el.imageryFilterSelect.addEventListener("change", () => {
    const brand = getActiveBrand();
    if (!brand) return;
    brand.imageryFilter = readAllowed(el.imageryFilterSelect.value, ["none", "vivid", "warm", "mono", "grain"], "none");
    refreshPreview();
    persistState();
  });

  el.palettePresetList.addEventListener("click", (event) => {
    const brand = getActiveBrand();
    if (!brand) return;

    const button = event.target.closest("button[data-preset-index]");
    if (!button) return;

    const preset = PALETTE_PRESETS[Number(button.dataset.presetIndex)];
    if (!preset) return;

    brand.palette = preset.colors.slice();
    brand.fgIndex = Math.min(brand.fgIndex, brand.palette.length - 1);
    brand.bgIndex = Math.min(brand.bgIndex, brand.palette.length - 1);

    renderPaletteEditor();
    renderContrastControls();
    renderContrastResult();
    refreshPreview();
    renderLaunchPack();
    persistState();
  });

  el.addColorBtn.addEventListener("click", () => {
    const brand = getActiveBrand();
    if (!brand) return;

    if (brand.palette.length >= 12) {
      setStatus("Palette already has maximum colors (12).", "warn");
      return;
    }

    brand.palette.push(generatePaletteColor(brand.palette.length));
    renderPaletteEditor();
    renderContrastControls();
    renderContrastResult();
    refreshPreview();
    renderLaunchPack();
    persistState();
  });

  el.paletteEditor.addEventListener("input", (event) => {
    const brand = getActiveBrand();
    if (!brand) return;

    const index = Number(event.target.dataset.index);
    if (!Number.isInteger(index)) return;

    if (event.target.matches("input[data-color]")) {
      const color = normalizeHex(event.target.value);
      if (!color) return;
      brand.palette[index] = color;
      renderPaletteEditor();
      renderContrastControls();
      renderContrastResult();
      refreshPreview();
      renderLaunchPack();
      persistState();
      return;
    }

    if (event.target.matches("input[data-hex]")) {
      const color = normalizeHex(event.target.value);
      if (!color) return;
      brand.palette[index] = color;
      renderPaletteEditor();
      renderContrastControls();
      renderContrastResult();
      refreshPreview();
      renderLaunchPack();
      persistState();
    }
  });

  el.paletteEditor.addEventListener("click", (event) => {
    const brand = getActiveBrand();
    if (!brand) return;

    const button = event.target.closest("button[data-remove-color]");
    if (!button) return;

    const index = Number(button.dataset.index);
    if (!Number.isInteger(index)) return;

    if (brand.palette.length <= 3) {
      setStatus("Keep at least 3 palette colors.", "warn");
      return;
    }

    brand.palette.splice(index, 1);
    brand.fgIndex = Math.min(brand.fgIndex, brand.palette.length - 1);
    brand.bgIndex = Math.min(brand.bgIndex, brand.palette.length - 1);

    renderPaletteEditor();
    renderContrastControls();
    renderContrastResult();
    refreshPreview();
    renderLaunchPack();
    persistState();
  });

  el.fgColorSelect.addEventListener("change", () => {
    const brand = getActiveBrand();
    if (!brand) return;

    brand.fgIndex = clampInt(el.fgColorSelect.value, 0, brand.palette.length - 1, 0);
    renderContrastResult();
    persistState();
  });

  el.bgColorSelect.addEventListener("change", () => {
    const brand = getActiveBrand();
    if (!brand) return;

    brand.bgIndex = clampInt(el.bgColorSelect.value, 0, brand.palette.length - 1, 1);
    renderContrastResult();
    persistState();
  });

  const addGoogleFont = async () => {
    const requested = sanitizeFontFamily(el.googleFontInput.value, "");
    if (!requested) {
      setStatus("Enter a Google font family name first.", "warn");
      return;
    }

    const loaded = await ensureGoogleFont(requested);
    if (!loaded) {
      setStatus(`Google font \"${requested}\" could not be loaded.`, "error");
      return;
    }

    if (!state.fontLibrary.googleFamilies.includes(requested)) {
      state.fontLibrary.googleFamilies.push(requested);
    }

    enforceBrandFontAvailability();
    renderFontControls();
    renderFontLibrary();
    renderTypePreview();
    refreshPreview();
    renderLaunchPack();
    persistState();
    el.googleFontInput.value = "";
    setStatus(`Google font \"${requested}\" added.`);
  };

  el.addGoogleFontBtn.addEventListener("click", () => addGoogleFont());
  el.googleFontInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addGoogleFont();
  });

  el.fontUploadInput.addEventListener("change", async (event) => {
    await addUploadedFonts(event.target.files);
    event.target.value = "";
  });

  el.customFontList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-font-action]");
    if (!button) return;

    const action = button.dataset.fontAction;
    const family = button.dataset.family;
    const id = button.dataset.id;

    if (action === "remove-google" && family) {
      state.fontLibrary.googleFamilies = state.fontLibrary.googleFamilies.filter((item) => item !== family);
      enforceBrandFontAvailability();
      renderFontControls();
      renderFontLibrary();
      renderTypePreview();
      refreshPreview();
      renderLaunchPack();
      persistState();
      setStatus(`Removed \"${family}\" from Google font list.`);
      return;
    }

    if (action === "remove-upload" && id) {
      state.fontLibrary.uploadedFonts = state.fontLibrary.uploadedFonts.filter((item) => item.id !== id);
      unloadUploadedFont(id);
      enforceBrandFontAvailability();
      renderFontControls();
      renderFontLibrary();
      renderTypePreview();
      refreshPreview();
      renderLaunchPack();
      persistState();
      setStatus("Uploaded font removed.");
    }
  });

  document.querySelectorAll(".upload-zone[data-drop-target]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("is-drag");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("is-drag");
    });

    zone.addEventListener("drop", async (event) => {
      event.preventDefault();
      zone.classList.remove("is-drag");
      const target = zone.dataset.dropTarget;
      if (target === "logos") {
        await appendAssetsFromFiles(event.dataTransfer?.files, "logos", MAX_LOGOS);
      } else if (target === "imagery") {
        await appendAssetsFromFiles(event.dataTransfer?.files, "imagery", MAX_IMAGES);
      }
    });
  });
}

function bindMessagingEvents() {
  el.campaignObjectiveInput.addEventListener("input", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.objective = sanitizeText(el.campaignObjectiveInput.value, 140, DEFAULT_CAMPAIGN_TEMPLATE.objective);
    refreshPreview();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  });

  el.campaignAudienceInput.addEventListener("input", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.audience = sanitizeText(el.campaignAudienceInput.value, 140, DEFAULT_CAMPAIGN_TEMPLATE.audience);
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  });

  el.campaignChannelInput.addEventListener("input", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.channel = sanitizeText(el.campaignChannelInput.value, 90, DEFAULT_CAMPAIGN_TEMPLATE.channel);
    refreshPreview();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  });

  el.campaignMessageInput.addEventListener("input", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.message = sanitizeText(el.campaignMessageInput.value, 400, DEFAULT_CAMPAIGN_TEMPLATE.message);
    refreshPreview();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  });

  el.campaignProofInput.addEventListener("input", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.proofPoints = parseProofPoints(el.campaignProofInput.value);
    renderLaunchPack();
    persistState();
  });

  el.campaignCtaInput.addEventListener("input", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.cta = sanitizeText(el.campaignCtaInput.value, 80, DEFAULT_CAMPAIGN_TEMPLATE.cta);
    refreshPreview();
    renderLaunchPack();
    persistState();
  });

  el.campaignToneInput.addEventListener("input", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.tone = sanitizeText(el.campaignToneInput.value, 140, DEFAULT_CAMPAIGN_TEMPLATE.tone);
    renderLaunchPack();
    persistState();
  });

  el.addMessageAngleBtn.addEventListener("click", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;
    campaign.messageAngles.push(createMessageAngle());
    renderMessageAngles();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  });

  const updateAngleField = (event) => {
    const campaign = getActiveCampaign();
    if (!campaign) return;

    const angleId = event.target.dataset.angleId;
    const field = event.target.dataset.angleField;
    if (!angleId || !field) return;

    const angle = campaign.messageAngles.find((item) => item.id === angleId);
    if (!angle) return;

    if (field === "segment") {
      angle.segment = sanitizeText(event.target.value, 90, "");
    } else if (field === "angle") {
      angle.angle = sanitizeText(event.target.value, 140, "");
    } else if (field === "offer") {
      angle.offer = sanitizeText(event.target.value, 120, "");
    }

    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  };

  el.messageAngleList.addEventListener("input", updateAngleField);
  el.messageAngleList.addEventListener("change", updateAngleField);

  el.messageAngleList.addEventListener("click", (event) => {
    const campaign = getActiveCampaign();
    if (!campaign) return;

    const button = event.target.closest("button[data-angle-remove]");
    if (!button) return;

    if (campaign.messageAngles.length <= 1) {
      setStatus("Keep at least one message angle.", "warn");
      return;
    }

    campaign.messageAngles = campaign.messageAngles.filter((item) => item.id !== button.dataset.angleRemove);
    renderMessageAngles();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  });
}

function bindCreativeEvents() {
  el.addCreativeBtn.addEventListener("click", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;

    campaign.creatives.push(createCreative({ title: `Creative ${campaign.creatives.length + 1}` }));
    renderCreativeBoard();
    refreshPreview();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  });

  el.generateCreativePackBtn.addEventListener("click", () => {
    const campaign = getActiveCampaign();
    if (!campaign) return;

    const generated = generateCreativePack(campaign);
    campaign.creatives.push(...generated);

    renderCreativeBoard();
    refreshPreview();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
    setStatus("Generated 3 creative concepts from your messaging inputs.");
  });

  const updateCreativeField = (event) => {
    const campaign = getActiveCampaign();
    if (!campaign) return;

    const creativeId = event.target.dataset.creativeId;
    const field = event.target.dataset.creativeField;
    if (!creativeId || !field) return;

    const creative = campaign.creatives.find((item) => item.id === creativeId);
    if (!creative) return;

    if (field === "title") {
      creative.title = sanitizeText(event.target.value, 90, "Untitled Creative");
    } else if (field === "format") {
      creative.format = readAllowed(event.target.value, CREATIVE_FORMATS, CREATIVE_FORMATS[0]);
    } else if (field === "status") {
      creative.status = readAllowed(event.target.value, CREATIVE_STATUSES, CREATIVE_STATUSES[0]);
      renderCreativeBoard();
    } else if (field === "hook") {
      creative.hook = sanitizeText(event.target.value, 260, "");
    }

    refreshPreview();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  };

  el.creativeBoard.addEventListener("input", updateCreativeField);
  el.creativeBoard.addEventListener("change", updateCreativeField);

  el.creativeBoard.addEventListener("click", (event) => {
    const campaign = getActiveCampaign();
    if (!campaign) return;

    const button = event.target.closest("button[data-creative-remove]");
    if (!button) return;

    if (campaign.creatives.length <= 1) {
      setStatus("Keep at least one creative in the campaign.", "warn");
      return;
    }

    campaign.creatives = campaign.creatives.filter((item) => item.id !== button.dataset.creativeRemove);
    renderCreativeBoard();
    refreshPreview();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
  });
}

function bindLaunchEvents() {
  el.copyBriefBtn.addEventListener("click", () => {
    copyToClipboard(buildCampaignBrief())
      .then(() => setStatus("Campaign brief copied."))
      .catch(() => {
        downloadText("campaign-brief.txt", buildCampaignBrief(), "text/plain");
        setStatus("Clipboard unavailable. Downloaded campaign brief instead.", "warn");
      });
  });

  el.copyCssBtn.addEventListener("click", () => {
    copyToClipboard(buildCssVariables())
      .then(() => setStatus("CSS variables copied."))
      .catch(() => {
        downloadText("adforge-brand-tokens.css", buildCssVariables(), "text/css");
        setStatus("Clipboard unavailable. Downloaded CSS file instead.", "warn");
      });
  });

  el.exportCssBtn.addEventListener("click", () => {
    downloadText("adforge-brand-tokens.css", buildCssVariables(), "text/css");
    setStatus("CSS variables downloaded.");
  });

  el.exportJsonBtn.addEventListener("click", () => {
    downloadText("adforge-design-os-export.json", JSON.stringify(buildExportState(), null, 2), "application/json");
    setStatus("Design OS JSON exported.");
  });

  el.importJsonBtn.addEventListener("click", () => el.importJsonInput.click());

  el.importJsonInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await applyImportedState(parsed);
      setStatus("Design OS JSON imported.");
    } catch {
      setStatus("Could not import JSON file.", "error");
    } finally {
      event.target.value = "";
    }
  });
}

function renderAll({ syncInputs = false } = {}) {
  coerceHierarchy(state);
  enforceBrandFontAvailability();

  renderJourney();
  renderStepVisibility();
  renderWorkspaceSelectors();

  if (syncInputs) {
    syncInputsFromState();
  } else {
    syncFontSelectValues();
  }

  renderPortfolioSummary();
  renderPalettePresets();
  renderPaletteEditor();
  renderContrastControls();
  renderContrastResult();
  renderLogoGrid();
  renderImageryGrid();
  renderFontControls();
  renderFontLibrary();
  renderTypePreview();
  renderMessageAngles();
  renderCreativeBoard();
  refreshPreview();
  renderHealthMetrics();
  renderLaunchPack();
}

function renderJourney() {
  const index = STEPS.indexOf(state.activeStep);
  const stepNumber = index >= 0 ? index + 1 : 1;
  const completion = buildStepCompletionMap();

  el.journeyNav.querySelectorAll("button[data-step]").forEach((button) => {
    const step = button.dataset.step;
    const ratio = completion[step] || 0;
    const percent = Math.round(ratio * 100);
    const isComplete = ratio >= 1;

    button.classList.toggle("is-active", step === state.activeStep);
    button.classList.toggle("is-complete", isComplete);
    button.dataset.completion = String(percent);

    const status = button.querySelector("[data-step-status]");
    if (status) {
      status.textContent = isComplete ? "Ready" : `${percent}%`;
    }
  });

  el.journeyProgressLabel.textContent = `Step ${stepNumber} of ${STEPS.length}`;
  el.journeyProgressFill.style.width = `${(stepNumber / STEPS.length) * 100}%`;

  if (el.journeyHint) {
    el.journeyHint.textContent = STEP_HINTS[state.activeStep] || STEP_HINTS.setup;
  }
}

function buildStepCompletionMap() {
  const client = getActiveClient();
  const brand = getActiveBrand();
  const campaign = getActiveCampaign();

  const setupChecks = [
    Boolean(client?.name),
    Boolean(brand?.name),
    Boolean(campaign?.name),
    state.clients.length > 0 && state.brands.length > 0 && state.campaigns.length > 0
  ];

  const brandChecks = [
    Boolean(brand?.tagline),
    Boolean(brand?.voice?.length),
    Boolean(brand?.logos?.length),
    Boolean(brand?.imagery?.length),
    (brand?.palette?.length || 0) >= 5,
    Boolean(brand?.headingFont && brand?.bodyFont && brand?.accentFont)
  ];

  const messageChecks = [
    Boolean(campaign?.objective),
    Boolean(campaign?.audience),
    Boolean(campaign?.message),
    Boolean(campaign?.cta),
    Boolean(campaign?.proofPoints?.length),
    Boolean(campaign?.messageAngles?.length)
  ];

  const creativeChecks = [
    (campaign?.creatives?.length || 0) >= 1,
    (campaign?.creatives?.length || 0) >= 3,
    Boolean(campaign?.creatives?.some((item) => item.status === "In Review" || item.status === "Approved" || item.status === "Live")),
    Boolean(campaign?.creatives?.some((item) => item.status === "Approved" || item.status === "Live"))
  ];

  const launchChecks = [
    brandChecks.every(Boolean),
    messageChecks.every(Boolean),
    creativeChecks[1] && creativeChecks[3],
    getContrastRatio(brand?.palette?.[brand?.fgIndex] || "#111111", brand?.palette?.[brand?.bgIndex] || "#ffffff") >= 4.5
  ];

  return {
    setup: ratioFromChecks(setupChecks),
    brand: ratioFromChecks(brandChecks),
    message: ratioFromChecks(messageChecks),
    creative: ratioFromChecks(creativeChecks),
    launch: ratioFromChecks(launchChecks)
  };
}

function ratioFromChecks(checks) {
  if (!checks.length) return 0;
  const passCount = checks.filter(Boolean).length;
  return passCount / checks.length;
}

function renderStepVisibility() {
  document.querySelectorAll(".stage-pane[data-pane]").forEach((pane) => {
    pane.classList.toggle("is-active", pane.dataset.pane === state.activeStep);
  });
}

function renderWorkspaceSelectors() {
  const clientOptions = state.clients
    .map((client) => `<option value="${client.id}">${escapeHtml(client.name)}</option>`)
    .join("");
  el.globalClientSelect.innerHTML = clientOptions;
  el.globalClientSelect.value = state.activeClientId;

  const brandOptions = getBrandsForClient(state.activeClientId)
    .map((brand) => `<option value="${brand.id}">${escapeHtml(brand.name)}</option>`)
    .join("");
  el.globalBrandSelect.innerHTML = brandOptions;
  el.globalBrandSelect.value = state.activeBrandId;

  const campaignOptions = getCampaignsForBrand(state.activeBrandId)
    .map((campaign) => `<option value="${campaign.id}">${escapeHtml(campaign.name)}</option>`)
    .join("");
  el.globalCampaignSelect.innerHTML = campaignOptions;
  el.globalCampaignSelect.value = state.activeCampaignId;

  if (el.workspaceContext) {
    const client = getActiveClient();
    const brand = getActiveBrand();
    const campaign = getActiveCampaign();
    const fallback = "No active workspace";
    const context = [client?.name, brand?.name, campaign?.name].filter(Boolean).join("  /  ");
    el.workspaceContext.textContent = context || fallback;
  }
}

function syncInputsFromState() {
  const client = getActiveClient();
  const brand = getActiveBrand();
  const campaign = getActiveCampaign();

  if (client) {
    el.setupClientNameInput.value = client.name;
  }

  if (brand) {
    el.setupBrandNameInput.value = brand.name;
    el.brandNameInput.value = brand.name;
    el.taglineInput.value = brand.tagline;
    el.voiceInput.value = brand.voice.join(", ");
    el.layoutStyleSelect.value = brand.layoutStyle;
    el.radiusInput.value = String(brand.radius);
    el.gradientAngleInput.value = String(brand.gradientAngle);
    el.overlayDensityInput.value = String(brand.overlayDensity);
    el.imageryFilterSelect.value = brand.imageryFilter;
    el.typeScaleInput.value = String(brand.typeScale);

    syncFontSelectValues();
  }

  if (campaign) {
    el.setupCampaignNameInput.value = campaign.name;
    el.campaignObjectiveInput.value = campaign.objective;
    el.campaignAudienceInput.value = campaign.audience;
    el.campaignChannelInput.value = campaign.channel;
    el.campaignMessageInput.value = campaign.message;
    el.campaignProofInput.value = campaign.proofPoints.join("\n");
    el.campaignCtaInput.value = campaign.cta;
    el.campaignToneInput.value = campaign.tone;
  }
}

function renderPortfolioSummary() {
  const totalCreatives = state.campaigns.reduce((sum, campaign) => sum + campaign.creatives.length, 0);
  const totalAngles = state.campaigns.reduce((sum, campaign) => sum + campaign.messageAngles.length, 0);
  const googleFontCount = state.fontLibrary.googleFamilies.length;
  const uploadFontCount = state.fontLibrary.uploadedFonts.length;

  el.portfolioSummary.textContent = `${state.clients.length} clients · ${state.brands.length} brands · ${state.campaigns.length} campaigns · ${totalAngles} message angles · ${totalCreatives} creative concepts · ${googleFontCount + uploadFontCount} custom fonts`;
}

function renderPalettePresets() {
  el.palettePresetList.innerHTML = PALETTE_PRESETS.map((preset, index) => {
    const swatches = preset.colors
      .slice(0, 5)
      .map((color) => `<span style=\"background:${color}\"></span>`)
      .join("");

    return `
      <button class=\"preset-btn\" type=\"button\" data-preset-index=\"${index}\" role=\"listitem\">
        <strong>${escapeHtml(preset.name)}</strong>
        <span class=\"preset-swatches\">${swatches}</span>
      </button>
    `;
  }).join("");
}

function renderPaletteEditor() {
  const brand = getActiveBrand();
  if (!brand) return;

  el.paletteEditor.innerHTML = brand.palette
    .map((color, index) => {
      return `
        <div class=\"palette-row\">
          <input type=\"color\" value=\"${color}\" data-color data-index=\"${index}\" aria-label=\"Palette color ${index + 1}\" />
          <input type=\"text\" value=\"${color}\" data-hex data-index=\"${index}\" aria-label=\"Hex value ${index + 1}\" />
          <button class=\"btn-mini\" type=\"button\" data-remove-color data-index=\"${index}\">Remove</button>
        </div>
      `;
    })
    .join("");
}

function renderContrastControls() {
  const brand = getActiveBrand();
  if (!brand) return;

  brand.fgIndex = clampInt(brand.fgIndex, 0, brand.palette.length - 1, 0);
  brand.bgIndex = clampInt(brand.bgIndex, 0, brand.palette.length - 1, 1);

  const options = brand.palette
    .map((color, index) => `<option value=\"${index}\">Color ${index + 1} ${color}</option>`)
    .join("");

  el.fgColorSelect.innerHTML = options;
  el.bgColorSelect.innerHTML = options;
  el.fgColorSelect.value = String(brand.fgIndex);
  el.bgColorSelect.value = String(brand.bgIndex);
}

function renderContrastResult() {
  const brand = getActiveBrand();
  if (!brand) return;

  const fg = brand.palette[brand.fgIndex] || DEFAULT_BRAND_TEMPLATE.palette[0];
  const bg = brand.palette[brand.bgIndex] || DEFAULT_BRAND_TEMPLATE.palette[4];
  const ratio = getContrastRatio(fg, bg);

  const aaBody = ratio >= 4.5;
  const aaLarge = ratio >= 3;

  el.contrastResult.innerHTML = `
    <div style=\"background:${bg};color:${fg};padding:0.5rem;border-radius:8px;border:1px solid rgba(16,30,52,0.16)\">Sample text for accessibility validation.</div>
    <strong>Contrast ${ratio.toFixed(2)}:1</strong>
    <span>${aaBody ? "AA body: Pass" : "AA body: Fail"}</span>
    <span>${aaLarge ? "AA large: Pass" : "AA large: Fail"}</span>
  `;
}

function renderLogoGrid() {
  const brand = getActiveBrand();
  if (!brand) return;

  if (!brand.logos.length) {
    el.logoGrid.innerHTML = `<div class=\"empty-state\">No logos uploaded yet.</div>`;
    return;
  }

  el.logoGrid.innerHTML = brand.logos
    .map((asset) => {
      const active = asset.id === brand.primaryLogoId;
      return `
        <article class=\"asset-card\">
          <img src=\"${asset.url}\" alt=\"${escapeHtml(asset.name)}\" />
          <div class=\"asset-meta\">
            <strong title=\"${escapeHtml(asset.name)}\">${escapeHtml(asset.name)}</strong>
            <div class=\"asset-actions\">
              <button class=\"btn-mini\" type=\"button\" data-action=\"primary\" data-id=\"${asset.id}\" data-active=\"${active}\">${active ? "Primary" : "Set Primary"}</button>
              <button class=\"btn-mini\" type=\"button\" data-action=\"remove\" data-id=\"${asset.id}\">Remove</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderImageryGrid() {
  const brand = getActiveBrand();
  if (!brand) return;

  if (!brand.imagery.length) {
    el.imageryGrid.innerHTML = `<div class=\"empty-state\">No imagery uploaded yet.</div>`;
    return;
  }

  el.imageryGrid.innerHTML = brand.imagery
    .map((asset) => {
      const active = asset.id === brand.heroImageId;
      return `
        <article class=\"asset-card\">
          <img src=\"${asset.url}\" alt=\"${escapeHtml(asset.name)}\" />
          <div class=\"asset-meta\">
            <strong title=\"${escapeHtml(asset.name)}\">${escapeHtml(asset.name)}</strong>
            <div class=\"asset-actions\">
              <button class=\"btn-mini\" type=\"button\" data-action=\"hero\" data-id=\"${asset.id}\" data-active=\"${active}\">${active ? "Hero" : "Set Hero"}</button>
              <button class=\"btn-mini\" type=\"button\" data-action=\"remove\" data-id=\"${asset.id}\">Remove</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderFontControls() {
  const options = getFontOptions();
  const markup = options.map((family) => `<option value=\"${escapeHtml(family)}\">${escapeHtml(family)}</option>`).join("");

  el.headingFontSelect.innerHTML = markup;
  el.bodyFontSelect.innerHTML = markup;
  el.accentFontSelect.innerHTML = markup;

  syncFontSelectValues();
}

function renderFontLibrary() {
  const googleItems = state.fontLibrary.googleFamilies.map((family) => ({ type: "google", family }));
  const uploadedItems = state.fontLibrary.uploadedFonts.map((asset) => ({ type: "upload", ...asset }));
  const combined = [...googleItems, ...uploadedItems];

  if (!combined.length) {
    el.customFontList.innerHTML = `<div class=\"empty-state\">Base font families loaded. Add any Google font or upload your own.</div>`;
    return;
  }

  el.customFontList.innerHTML = combined
    .map((item) => {
      if (item.type === "google") {
        return `
          <article class=\"font-item\">
            <div>
              <strong>${escapeHtml(item.family)}</strong>
              <small>Google font</small>
            </div>
            <button class=\"btn-mini\" type=\"button\" data-font-action=\"remove-google\" data-family=\"${escapeHtml(item.family)}\">Remove</button>
          </article>
        `;
      }

      return `
        <article class=\"font-item\">
          <div>
            <strong>${escapeHtml(item.family)}</strong>
            <small>Uploaded ${escapeHtml(item.format.toUpperCase())}</small>
          </div>
          <button class=\"btn-mini\" type=\"button\" data-font-action=\"remove-upload\" data-id=\"${item.id}\">Remove</button>
        </article>
      `;
    })
    .join("");
}

function syncFontSelectValues() {
  const brand = getActiveBrand();
  if (!brand) return;

  setSelectValue(el.headingFontSelect, brand.headingFont, DEFAULT_BRAND_TEMPLATE.headingFont);
  setSelectValue(el.bodyFontSelect, brand.bodyFont, DEFAULT_BRAND_TEMPLATE.bodyFont);
  setSelectValue(el.accentFontSelect, brand.accentFont, DEFAULT_BRAND_TEMPLATE.accentFont);
}

function renderTypePreview() {
  const brand = getActiveBrand();
  if (!brand) return;

  el.typePreview.style.fontFamily = wrapFont(brand.bodyFont);
  const heading = el.typePreview.querySelector("h3");
  const kicker = el.typePreview.querySelector(".type-kicker");
  if (heading) heading.style.fontFamily = wrapFont(brand.headingFont);
  if (kicker) kicker.style.fontFamily = wrapFont(brand.accentFont);

  el.radiusValue.textContent = `${brand.radius}px`;
  el.angleValue.textContent = `${brand.gradientAngle}°`;
  el.overlayValue.textContent = `${brand.overlayDensity}%`;
  el.scaleValue.textContent = `${brand.typeScale}%`;
}

function renderMessageAngles() {
  const campaign = getActiveCampaign();
  if (!campaign) return;

  if (!campaign.messageAngles.length) {
    el.messageAngleList.innerHTML = `<div class=\"empty-state\">No message angles yet.</div>`;
    return;
  }

  el.messageAngleList.innerHTML = campaign.messageAngles
    .map((angle, index) => {
      return `
        <article class=\"angle-row\">
          <div class=\"row-actions\" style=\"justify-content:space-between;align-items:center\">
            <strong style=\"font-size:0.75rem\">Angle ${index + 1}</strong>
            <button class=\"btn-mini\" type=\"button\" data-angle-remove=\"${angle.id}\">Remove</button>
          </div>
          <div class=\"angle-grid\">
            <label class=\"field\">
              <span>Segment</span>
              <input type=\"text\" maxlength=\"90\" value=\"${escapeHtml(angle.segment)}\" data-angle-id=\"${angle.id}\" data-angle-field=\"segment\" />
            </label>
            <label class=\"field\">
              <span>Angle</span>
              <input type=\"text\" maxlength=\"140\" value=\"${escapeHtml(angle.angle)}\" data-angle-id=\"${angle.id}\" data-angle-field=\"angle\" />
            </label>
          </div>
          <label class=\"field\">
            <span>Offer / Proof Lever</span>
            <input type=\"text\" maxlength=\"120\" value=\"${escapeHtml(angle.offer)}\" data-angle-id=\"${angle.id}\" data-angle-field=\"offer\" />
          </label>
        </article>
      `;
    })
    .join("");
}

function renderCreativeBoard() {
  const campaign = getActiveCampaign();
  if (!campaign) return;

  const columns = CREATIVE_STATUSES.map((status) => {
    const cards = campaign.creatives.filter((creative) => creative.status === status);

    const cardMarkup = cards.length
      ? cards
          .map((creative) => {
            return `
              <article class=\"creative-card\">
                <label class=\"field\">
                  <span>Title</span>
                  <input type=\"text\" maxlength=\"90\" value=\"${escapeHtml(creative.title)}\" data-creative-id=\"${creative.id}\" data-creative-field=\"title\" />
                </label>
                <label class=\"field\">
                  <span>Format</span>
                  <select data-creative-id=\"${creative.id}\" data-creative-field=\"format\">${buildOptionMarkup(CREATIVE_FORMATS, creative.format)}</select>
                </label>
                <label class=\"field\">
                  <span>Status</span>
                  <select data-creative-id=\"${creative.id}\" data-creative-field=\"status\">${buildOptionMarkup(CREATIVE_STATUSES, creative.status)}</select>
                </label>
                <label class=\"field\">
                  <span>Hook</span>
                  <textarea rows=\"3\" maxlength=\"260\" data-creative-id=\"${creative.id}\" data-creative-field=\"hook\">${escapeHtml(
                    creative.hook
                  )}</textarea>
                </label>
                <div class=\"row-actions\">
                  <button class=\"btn-mini\" type=\"button\" data-creative-remove=\"${creative.id}\">Remove</button>
                </div>
              </article>
            `;
          })
          .join("")
      : `<div class=\"empty-state\">No creatives in this lane.</div>`;

    return `
      <section class=\"status-column\">
        <h4>${status}</h4>
        ${cardMarkup}
      </section>
    `;
  }).join("");

  el.creativeBoard.innerHTML = columns;
}

function refreshPreview() {
  const brand = getActiveBrand();
  const campaign = getActiveCampaign();
  if (!brand || !campaign) return;

  const previewScope = el.previewStage;
  const typeScope = el.typePreview;
  const palette = normalizePalette(brand.palette);

  previewScope.style.setProperty("--brand-1", palette[0]);
  previewScope.style.setProperty("--brand-2", palette[1]);
  previewScope.style.setProperty("--brand-3", palette[2]);
  previewScope.style.setProperty("--brand-4", palette[3] || palette[2]);
  previewScope.style.setProperty("--brand-5", palette[4] || palette[0]);
  previewScope.style.setProperty("--brand-6", palette[5] || palette[1]);
  previewScope.style.setProperty("--preview-heading-font", wrapFont(brand.headingFont));
  previewScope.style.setProperty("--preview-body-font", wrapFont(brand.bodyFont));
  previewScope.style.setProperty("--preview-accent-font", wrapFont(brand.accentFont));
  previewScope.style.setProperty("--preview-type-scale", String(brand.typeScale / 100));
  previewScope.style.setProperty("--preview-radius-lg", `${brand.radius}px`);
  previewScope.style.setProperty("--preview-radius-md", `${Math.max(10, brand.radius - 7)}px`);
  previewScope.style.setProperty("--preview-overlay-density", String(brand.overlayDensity / 100));
  previewScope.style.setProperty("--preview-gradient-angle", `${brand.gradientAngle}deg`);

  typeScope.style.setProperty("--preview-type-scale", String(brand.typeScale / 100));
  typeScope.style.setProperty("--preview-radius-md", `${Math.max(10, brand.radius - 7)}px`);

  el.previewHeadline.textContent = campaign.name || brand.name;
  el.previewTagline.textContent = campaign.message || brand.tagline;
  el.previewCtaBtn.textContent = campaign.cta || "Launch";

  const leadCreative = campaign.creatives[0];
  el.mockTitle.textContent = leadCreative?.title || `${brand.voice[0] || "Confident"} creative system`;
  el.mockBody.textContent = leadCreative?.hook || campaign.message;

  el.previewStage.classList.remove("layout-split", "layout-poster", "layout-focus");
  el.previewStage.classList.add(`layout-${brand.layoutStyle}`);

  el.previewStage.classList.remove("filter-none", "filter-vivid", "filter-warm", "filter-mono", "filter-grain");
  el.previewStage.classList.add(`filter-${brand.imageryFilter}`);

  renderVoiceChips();
  renderPreviewLogo();
  renderPreviewImage();
}

function renderVoiceChips() {
  const brand = getActiveBrand();
  const campaign = getActiveCampaign();
  if (!brand || !campaign) {
    el.voiceChipList.innerHTML = "";
    return;
  }

  const chips = [
    ...normalizeVoiceArray(brand.voice),
    shortChip(campaign.channel),
    shortChip(campaign.objective)
  ]
    .filter(Boolean)
    .slice(0, 6);

  el.voiceChipList.innerHTML = chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("");
}

function renderPreviewLogo() {
  const brand = getActiveBrand();
  if (!brand) return;

  const logo = getPrimaryLogo();
  if (!logo) {
    const initials = getInitials(brand.name || "AF");
    el.previewLogoSlot.innerHTML = `<span class=\"logo-monogram\">${escapeHtml(initials)}</span>`;
    return;
  }

  el.previewLogoSlot.innerHTML = `<img src=\"${logo.url}\" alt=\"Primary logo\" />`;
}

function renderPreviewImage() {
  const image = getHeroImage();
  if (!image) {
    el.previewHeroImage.style.backgroundImage = "none";
    el.previewHeroImage.style.opacity = "0";
    return;
  }

  el.previewHeroImage.style.backgroundImage = `url(${image.url})`;
  el.previewHeroImage.style.opacity = "1";
}

function renderHealthMetrics() {
  const brand = getActiveBrand();
  const campaign = getActiveCampaign();

  if (!brand || !campaign) {
    el.healthMetrics.innerHTML = "";
    return;
  }

  const totalCreatives = state.campaigns.reduce((sum, item) => sum + item.creatives.length, 0);
  const readyCreatives = campaign.creatives.filter((creative) => creative.status === "Approved" || creative.status === "Live").length;
  const contrastRatio = getContrastRatio(brand.palette[brand.fgIndex], brand.palette[brand.bgIndex]);
  const assetCoverage = Math.round(
    ((brand.logos.length > 0 ? 1 : 0) + (brand.imagery.length > 0 ? 1 : 0) + (campaign.messageAngles.length > 0 ? 1 : 0)) / 3 * 100
  );

  const metrics = [
    { label: "Portfolio creatives", value: `${totalCreatives}` },
    { label: "Ready creatives", value: `${readyCreatives}` },
    { label: "Asset coverage", value: `${assetCoverage}%` },
    { label: "Contrast ratio", value: `${contrastRatio.toFixed(2)}:1` },
    { label: "Message angles", value: `${campaign.messageAngles.length}` }
  ];

  el.healthMetrics.innerHTML = metrics
    .map((metric) => {
      return `
        <div class=\"metric-item\">
          <strong>${metric.label}</strong>
          <span>${metric.value}</span>
        </div>
      `;
    })
    .join("");
}

function renderLaunchPack() {
  el.cssPreview.textContent = buildCssVariables();
  el.campaignBriefPreview.textContent = buildCampaignBrief();
  renderLaunchChecklist();
}

function renderLaunchChecklist() {
  const brand = getActiveBrand();
  const campaign = getActiveCampaign();
  if (!brand || !campaign) {
    el.launchChecklist.innerHTML = "";
    return;
  }

  const checks = [
    { label: "Brand name and tagline defined", pass: Boolean(brand.name && brand.tagline) },
    { label: "At least one logo uploaded", pass: brand.logos.length > 0 },
    { label: "At least one hero image uploaded", pass: brand.imagery.length > 0 },
    { label: "Palette contains 5+ colors", pass: brand.palette.length >= 5 },
    { label: "Typography system assigned", pass: Boolean(brand.headingFont && brand.bodyFont && brand.accentFont) },
    { label: "Campaign objective and audience defined", pass: Boolean(campaign.objective && campaign.audience) },
    { label: "Campaign message and CTA defined", pass: Boolean(campaign.message && campaign.cta) },
    { label: "At least 3 creative concepts", pass: campaign.creatives.length >= 3 },
    { label: "At least one creative approved/live", pass: campaign.creatives.some((item) => item.status === "Approved" || item.status === "Live") }
  ];

  el.launchChecklist.innerHTML = checks
    .map((check) => {
      return `<div class=\"check-item ${check.pass ? "" : "fail"}\"><span class=\"dot\"></span>${check.label}</div>`;
    })
    .join("");
}

function buildCssVariables() {
  const brand = getActiveBrand() || createBrand(createId("client"));
  const palette = normalizePalette(brand.palette);

  return `:root {\n  --brand-1: ${palette[0]};\n  --brand-2: ${palette[1]};\n  --brand-3: ${palette[2]};\n  --brand-4: ${palette[3] || palette[2]};\n  --brand-5: ${palette[4] || palette[0]};\n  --brand-6: ${palette[5] || palette[1]};\n  --font-heading: ${wrapFont(
    brand.headingFont
  )};\n  --font-body: ${wrapFont(brand.bodyFont)};\n  --font-accent: ${wrapFont(brand.accentFont)};\n  --radius-lg: ${brand.radius}px;\n  --radius-md: ${Math.max(
    10,
    brand.radius - 7
  )}px;\n  --type-scale: ${(brand.typeScale / 100).toFixed(2)};\n}`;
}

function buildCampaignBrief() {
  const client = getActiveClient();
  const brand = getActiveBrand();
  const campaign = getActiveCampaign();
  if (!client || !brand || !campaign) return "No active workspace.";

  const proof = campaign.proofPoints.map((line) => `- ${line}`).join("\n");
  const angles = campaign.messageAngles
    .map((angle, index) => `${index + 1}. ${angle.segment || "Segment"}: ${angle.angle || "Angle"} (${angle.offer || "Offer"})`)
    .join("\n");

  return [
    `Client: ${client.name}`,
    `Brand: ${brand.name}`,
    `Campaign: ${campaign.name}`,
    "",
    `Objective: ${campaign.objective}`,
    `Audience: ${campaign.audience}`,
    `Channel mix: ${campaign.channel}`,
    `Tone guardrails: ${campaign.tone}`,
    "",
    "Primary message:",
    campaign.message,
    "",
    "Proof points:",
    proof,
    "",
    "Message angles:",
    angles,
    "",
    `CTA: ${campaign.cta}`,
    `Creative count: ${campaign.creatives.length}`
  ].join("\n");
}

function buildExportState() {
  return {
    version: 3,
    exportedAt: new Date().toISOString(),
    activeStep: state.activeStep,
    activeClientId: state.activeClientId,
    activeBrandId: state.activeBrandId,
    activeCampaignId: state.activeCampaignId,
    fontLibrary: state.fontLibrary,
    clients: state.clients,
    brands: state.brands,
    campaigns: state.campaigns
  };
}

async function applyImportedState(payload) {
  const next = sanitizeState(payload || {});
  replaceState(next);
  await hydrateFontLibrary();
  renderAll({ syncInputs: true });
  persistState();
}

function addClient() {
  const client = createClient(`Client ${state.clients.length + 1}`);
  state.clients.push(client);

  const brand = createBrand(client.id, { name: `${client.name} Brand 1` });
  state.brands.push(brand);

  const campaign = createCampaign(brand.id, { name: "Launch Sprint" });
  state.campaigns.push(campaign);

  state.activeClientId = client.id;
  state.activeBrandId = brand.id;
  state.activeCampaignId = campaign.id;

  renderAll({ syncInputs: true });
  persistState();
  setStatus("Client workspace created.");
}

function deleteClient() {
  if (state.clients.length <= 1) {
    setStatus("At least one client workspace is required.", "warn");
    return;
  }

  const client = getActiveClient();
  if (!client) return;

  const confirmed = window.confirm(`Delete client \"${client.name}\" and all connected brands/campaigns?`);
  if (!confirmed) return;

  const brandIds = state.brands.filter((brand) => brand.clientId === client.id).map((brand) => brand.id);
  state.clients = state.clients.filter((item) => item.id !== client.id);
  state.brands = state.brands.filter((brand) => brand.clientId !== client.id);
  state.campaigns = state.campaigns.filter((campaign) => !brandIds.includes(campaign.brandId));

  coerceHierarchy(state);
  renderAll({ syncInputs: true });
  persistState();
  setStatus("Client deleted.");
}

function addBrand() {
  const client = getActiveClient();
  if (!client) return;

  const count = getBrandsForClient(client.id).length + 1;
  const brand = createBrand(client.id, { name: `${client.name} Brand ${count}` });
  state.brands.push(brand);

  const campaign = createCampaign(brand.id, { name: "Launch Sprint" });
  state.campaigns.push(campaign);

  state.activeBrandId = brand.id;
  state.activeCampaignId = campaign.id;

  renderAll({ syncInputs: true });
  persistState();
  setStatus("Brand created.");
}

function cloneBrand() {
  const source = getActiveBrand();
  const client = getActiveClient();
  if (!source || !client) return;

  const clone = createBrand(client.id, {
    ...source,
    id: null,
    name: `${source.name} Clone`,
    logos: source.logos.map((asset) => ({ ...asset, id: createId("logo") })),
    imagery: source.imagery.map((asset) => ({ ...asset, id: createId("img") })),
    primaryLogoId: null,
    heroImageId: null
  });

  if (clone.logos[0]) clone.primaryLogoId = clone.logos[0].id;
  if (clone.imagery[0]) clone.heroImageId = clone.imagery[0].id;

  state.brands.push(clone);

  const campaign = createCampaign(clone.id, {
    ...DEMO_CAMPAIGN_PATCH,
    name: `${clone.name} Launch`
  });
  state.campaigns.push(campaign);

  state.activeBrandId = clone.id;
  state.activeCampaignId = campaign.id;

  renderAll({ syncInputs: true });
  persistState();
  setStatus("Brand cloned with style system and assets.");
}

function deleteBrand() {
  const brand = getActiveBrand();
  const client = getActiveClient();
  if (!brand || !client) return;

  if (getBrandsForClient(client.id).length <= 1) {
    setStatus("Each client must retain at least one brand.", "warn");
    return;
  }

  const confirmed = window.confirm(`Delete brand \"${brand.name}\" and all linked campaigns?`);
  if (!confirmed) return;

  state.brands = state.brands.filter((item) => item.id !== brand.id);
  state.campaigns = state.campaigns.filter((item) => item.brandId !== brand.id);

  coerceHierarchy(state);
  renderAll({ syncInputs: true });
  persistState();
  setStatus("Brand deleted.");
}

function addCampaign() {
  const brand = getActiveBrand();
  if (!brand) return;

  const campaign = createCampaign(brand.id, { name: `Campaign ${getCampaignsForBrand(brand.id).length + 1}` });
  state.campaigns.push(campaign);
  state.activeCampaignId = campaign.id;

  renderAll({ syncInputs: true });
  persistState();
  setStatus("Campaign created.");
}

function duplicateCampaign() {
  const source = getActiveCampaign();
  const brand = getActiveBrand();
  if (!source || !brand) return;

  const copy = createCampaign(brand.id, {
    ...source,
    id: null,
    name: `${source.name} Copy`,
    messageAngles: source.messageAngles.map((angle) => ({ ...angle, id: createId("angle") })),
    creatives: source.creatives.map((creative) => ({ ...creative, id: createId("creative") }))
  });

  state.campaigns.push(copy);
  state.activeCampaignId = copy.id;

  renderAll({ syncInputs: true });
  persistState();
  setStatus("Campaign duplicated.");
}

function deleteCampaign() {
  const campaign = getActiveCampaign();
  const brand = getActiveBrand();
  if (!campaign || !brand) return;

  if (getCampaignsForBrand(brand.id).length <= 1) {
    setStatus("Each brand must retain at least one campaign.", "warn");
    return;
  }

  const confirmed = window.confirm(`Delete campaign \"${campaign.name}\"?`);
  if (!confirmed) return;

  state.campaigns = state.campaigns.filter((item) => item.id !== campaign.id);
  coerceHierarchy(state);
  renderAll({ syncInputs: true });
  persistState();
  setStatus("Campaign deleted.");
}

function applyDemoStack() {
  const brand = getActiveBrand();
  const campaign = getActiveCampaign();
  if (!brand || !campaign) return;

  const logos = brand.logos;
  const imagery = brand.imagery;
  const primaryLogoId = brand.primaryLogoId;
  const heroImageId = brand.heroImageId;

  const patchedBrand = createBrand(brand.clientId, {
    ...DEMO_BRAND_PATCH,
    id: brand.id,
    logos,
    imagery,
    primaryLogoId,
    heroImageId
  });

  const patchedCampaign = createCampaign(brand.id, {
    ...DEMO_CAMPAIGN_PATCH,
    id: campaign.id,
    messageAngles: campaign.messageAngles,
    creatives: campaign.creatives
  });

  replaceBrand(patchedBrand);
  replaceCampaign(patchedCampaign);
}

function replaceBrand(nextBrand) {
  state.brands = state.brands.map((brand) => (brand.id === nextBrand.id ? nextBrand : brand));
}

function replaceCampaign(nextCampaign) {
  state.campaigns = state.campaigns.map((campaign) => (campaign.id === nextCampaign.id ? nextCampaign : campaign));
}

async function appendAssetsFromFiles(fileList, key, maxItems) {
  const brand = getActiveBrand();
  if (!brand) return;

  const files = Array.from(fileList || [])
    .filter((file) => file.type.startsWith("image/"))
    .slice(0, maxItems);

  if (!files.length) {
    setStatus("No valid image files detected.", "warn");
    return;
  }

  const roomLeft = Math.max(0, maxItems - brand[key].length);
  if (!roomLeft) {
    setStatus(`Reached upload limit for ${key}.`, "warn");
    return;
  }

  const acceptedFiles = files.slice(0, roomLeft);

  try {
    const assets = await Promise.all(acceptedFiles.map((file) => fileToAsset(file, key === "logos" ? "logo" : "img")));
    brand[key] = [...brand[key], ...assets];

    if (key === "logos" && !brand.primaryLogoId) {
      brand.primaryLogoId = brand.logos[0] ? brand.logos[0].id : null;
    }

    if (key === "imagery" && !brand.heroImageId) {
      brand.heroImageId = brand.imagery[0] ? brand.imagery[0].id : null;
    }

    if (key === "logos") {
      renderLogoGrid();
    } else {
      renderImageryGrid();
    }

    refreshPreview();
    renderHealthMetrics();
    renderLaunchPack();
    persistState();
    setStatus(`Added ${assets.length} ${key}.`);
  } catch {
    setStatus("One or more files could not be read.", "error");
  }
}

async function addUploadedFonts(fileList) {
  const files = Array.from(fileList || []).filter(isFontFile);
  if (!files.length) {
    setStatus("No valid font files detected.", "warn");
    return;
  }

  const roomLeft = Math.max(0, MAX_UPLOADED_FONTS - state.fontLibrary.uploadedFonts.length);
  if (!roomLeft) {
    setStatus(`Uploaded font limit reached (${MAX_UPLOADED_FONTS}).`, "warn");
    return;
  }

  const accepted = files.slice(0, roomLeft);
  const loadedFamilies = [];

  for (const file of accepted) {
    try {
      const format = deriveFontFormat(file);
      const dataUrl = await fileToDataUrl(file);
      const baseFamily = sanitizeFontFamily(file.name.replace(/\.[^/.]+$/, ""), "Uploaded Font");
      const family = makeUniqueFontFamily(baseFamily);

      const fontAsset = {
        id: createId("font"),
        family,
        format,
        dataUrl
      };

      const loaded = await ensureUploadedFont(fontAsset);
      if (!loaded) continue;

      state.fontLibrary.uploadedFonts.push(fontAsset);
      loadedFamilies.push(family);
    } catch {
      setStatus(`Could not load font file \"${file.name}\".`, "error");
    }
  }

  if (!loadedFamilies.length) {
    return;
  }

  enforceBrandFontAvailability();
  renderFontControls();
  renderFontLibrary();
  renderTypePreview();
  refreshPreview();
  renderLaunchPack();
  persistState();
  setStatus(`Loaded fonts: ${loadedFamilies.join(", ")}`);
}

async function hydrateFontLibrary() {
  state.fontLibrary = sanitizeFontLibrary(state.fontLibrary);

  for (const family of state.fontLibrary.googleFamilies) {
    await ensureGoogleFont(family);
  }

  const hydratedUploads = [];
  for (const fontAsset of state.fontLibrary.uploadedFonts) {
    const loaded = await ensureUploadedFont(fontAsset);
    if (loaded) hydratedUploads.push(fontAsset);
  }

  state.fontLibrary.uploadedFonts = hydratedUploads;
}

function getFontOptions() {
  const options = new Set(BASE_FONT_OPTIONS);
  state.fontLibrary.googleFamilies.forEach((family) => options.add(family));
  state.fontLibrary.uploadedFonts.forEach((asset) => options.add(asset.family));
  return [...options];
}

function enforceBrandFontAvailability() {
  const options = getFontOptions();
  state.brands.forEach((brand) => {
    brand.headingFont = options.includes(brand.headingFont) ? brand.headingFont : DEFAULT_BRAND_TEMPLATE.headingFont;
    brand.bodyFont = options.includes(brand.bodyFont) ? brand.bodyFont : DEFAULT_BRAND_TEMPLATE.bodyFont;
    brand.accentFont = options.includes(brand.accentFont) ? brand.accentFont : DEFAULT_BRAND_TEMPLATE.accentFont;
  });
}

async function ensureGoogleFont(familyName) {
  const family = sanitizeFontFamily(familyName, "");
  if (!family) return false;

  const linkId = `google-font-${slugify(family)}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@300;400;500;600;700;800&display=swap`;
    document.head.append(link);

    await new Promise((resolve) => {
      const timeout = window.setTimeout(resolve, 1600);
      link.onload = () => {
        window.clearTimeout(timeout);
        resolve();
      };
      link.onerror = () => {
        window.clearTimeout(timeout);
        resolve();
      };
    });
  }

  try {
    await document.fonts.load(`1em \"${family}\"`);
    return true;
  } catch {
    return false;
  }
}

async function ensureUploadedFont(fontAsset) {
  if (!fontAsset?.id || !fontAsset?.family || !fontAsset?.dataUrl) return false;
  if (!FONT_FORMATS.includes(fontAsset.format)) return false;
  if (runtimeUploadedFontFaces.has(fontAsset.id)) return true;

  try {
    const face = new FontFace(fontAsset.family, `url(${fontAsset.dataUrl}) format(\"${fontAsset.format}\")`);
    await face.load();
    document.fonts.add(face);
    runtimeUploadedFontFaces.set(fontAsset.id, face);
    return true;
  } catch {
    return false;
  }
}

function unloadUploadedFont(fontId) {
  const face = runtimeUploadedFontFaces.get(fontId);
  if (face) {
    document.fonts.delete(face);
    runtimeUploadedFontFaces.delete(fontId);
  }
}

function isFontFile(file) {
  if (!file) return false;
  return FONT_FILE_EXTENSIONS.includes(getFileExtension(file.name));
}

function deriveFontFormat(file) {
  const ext = getFileExtension(file.name);
  if (ext === "woff2") return "woff2";
  if (ext === "woff") return "woff";
  if (ext === "otf") return "opentype";
  return "truetype";
}

function makeUniqueFontFamily(candidate) {
  const base = sanitizeFontFamily(candidate, "Uploaded Font");
  const existing = new Set(getFontOptions());
  if (!existing.has(base)) return base;

  let count = 2;
  while (existing.has(`${base} ${count}`)) {
    count += 1;
  }
  return `${base} ${count}`;
}

function createInitialState() {
  const saved = readSavedState();
  if (saved) {
    return saved;
  }
  return createSeedState();
}

function readSavedState() {
  const parse = (raw) => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const v3 = parse(localStorage.getItem(STORAGE_KEY));
  if (v3) {
    return sanitizeState(v3);
  }

  for (const key of LEGACY_KEYS) {
    const legacy = parse(localStorage.getItem(key));
    if (legacy) {
      return sanitizeState(legacy);
    }
  }

  return null;
}

function persistState() {
  const payload = {
    version: 3,
    activeStep: state.activeStep,
    activeClientId: state.activeClientId,
    activeBrandId: state.activeBrandId,
    activeCampaignId: state.activeCampaignId,
    fontLibrary: {
      googleFamilies: state.fontLibrary.googleFamilies,
      uploadedFonts: state.fontLibrary.uploadedFonts
        .filter((fontAsset) => fontAsset.dataUrl.length < 170000)
        .slice(0, 6)
    },
    clients: state.clients,
    brands: state.brands.map((brand) => ({
      ...brand,
      logos: [],
      imagery: [],
      primaryLogoId: null,
      heroImageId: null
    })),
    campaigns: state.campaigns
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    const fallback = {
      ...payload,
      fontLibrary: {
        googleFamilies: state.fontLibrary.googleFamilies,
        uploadedFonts: []
      }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      setStatus("Saved project without large uploaded font binaries (storage limit).", "warn");
    } catch {
      setStatus("Could not persist local project state.", "warn");
    }
  }
}

function sanitizeState(input) {
  if (Array.isArray(input.clients) && Array.isArray(input.brands) && Array.isArray(input.campaigns)) {
    const clients = input.clients.map((client, index) => sanitizeClient(client, index)).filter(Boolean);
    if (!clients.length) {
      clients.push(createClient("Client 1"));
    }

    const brands = input.brands
      .map((brand, index) => sanitizeBrand(brand, index, clients.map((client) => client.id)))
      .filter(Boolean);

    if (!brands.length) {
      brands.push(createBrand(clients[0].id));
    }

    clients.forEach((client) => {
      if (!brands.some((brand) => brand.clientId === client.id)) {
        brands.push(createBrand(client.id, { name: `${client.name} Brand 1` }));
      }
    });

    const campaigns = input.campaigns
      .map((campaign, index) => sanitizeCampaign(campaign, index, brands.map((brand) => brand.id)))
      .filter(Boolean);

    if (!campaigns.length) {
      campaigns.push(createCampaign(brands[0].id));
    }

    brands.forEach((brand) => {
      if (!campaigns.some((campaign) => campaign.brandId === brand.id)) {
        campaigns.push(createCampaign(brand.id));
      }
    });

    const next = {
      activeStep: readAllowed(input.activeStep, STEPS, "setup"),
      activeClientId: input.activeClientId,
      activeBrandId: input.activeBrandId,
      activeCampaignId: input.activeCampaignId,
      fontLibrary: sanitizeFontLibrary(input.fontLibrary),
      clients,
      brands,
      campaigns
    };

    coerceHierarchy(next);
    return next;
  }

  return migrateLegacyState(input);
}

function migrateLegacyState(legacy) {
  const next = createSeedState();
  const brand = next.brands[0];
  const campaign = next.campaigns[0];

  if (legacy && typeof legacy === "object") {
    brand.name = sanitizeText(legacy.brandName || legacy.name, 80, DEFAULT_BRAND_TEMPLATE.name);
    brand.tagline = sanitizeText(legacy.tagline, 120, DEFAULT_BRAND_TEMPLATE.tagline);
    brand.voice = normalizeVoiceArray(legacy.voice);
    brand.palette = normalizePalette(legacy.palette);
    brand.headingFont = sanitizeFontFamily(legacy.headingFont, DEFAULT_BRAND_TEMPLATE.headingFont);
    brand.bodyFont = sanitizeFontFamily(legacy.bodyFont, DEFAULT_BRAND_TEMPLATE.bodyFont);
    brand.accentFont = sanitizeFontFamily(legacy.accentFont, DEFAULT_BRAND_TEMPLATE.accentFont);
    brand.typeScale = clampInt(legacy.typeScale, 84, 136, DEFAULT_BRAND_TEMPLATE.typeScale);
    brand.radius = clampInt(legacy.radius, 8, 40, DEFAULT_BRAND_TEMPLATE.radius);
    brand.gradientAngle = clampInt(legacy.gradientAngle, 0, 360, DEFAULT_BRAND_TEMPLATE.gradientAngle);
    brand.overlayDensity = clampInt(legacy.overlayDensity, 0, 90, DEFAULT_BRAND_TEMPLATE.overlayDensity);
    brand.layoutStyle = readAllowed(legacy.layoutStyle, ["split", "poster", "focus"], DEFAULT_BRAND_TEMPLATE.layoutStyle);
    brand.imageryFilter = readAllowed(legacy.imageryFilter, ["none", "vivid", "warm", "mono", "grain"], DEFAULT_BRAND_TEMPLATE.imageryFilter);

    campaign.name = `${brand.name} Launch`;
    campaign.message = brand.tagline;

    if (legacy.fontLibrary) {
      next.fontLibrary = sanitizeFontLibrary(legacy.fontLibrary);
    }
  }

  return next;
}

function replaceState(next) {
  state.activeStep = next.activeStep;
  state.activeClientId = next.activeClientId;
  state.activeBrandId = next.activeBrandId;
  state.activeCampaignId = next.activeCampaignId;
  state.fontLibrary = next.fontLibrary;
  state.clients = next.clients;
  state.brands = next.brands;
  state.campaigns = next.campaigns;

  coerceHierarchy(state);
}

function createSeedState() {
  const client = createClient("AdForge Group");
  const brand = createBrand(client.id, { name: DEFAULT_BRAND_TEMPLATE.name });
  const campaign = createCampaign(brand.id, { name: "Q3 Growth Launch" });

  return {
    activeStep: "setup",
    activeClientId: client.id,
    activeBrandId: brand.id,
    activeCampaignId: campaign.id,
    fontLibrary: {
      googleFamilies: [],
      uploadedFonts: []
    },
    clients: [client],
    brands: [brand],
    campaigns: [campaign]
  };
}

function coerceHierarchy(target) {
  target.fontLibrary = sanitizeFontLibrary(target.fontLibrary);
  target.activeStep = readAllowed(target.activeStep, STEPS, "setup");

  if (!target.clients.length) {
    target.clients.push(createClient("Client 1"));
  }

  if (!target.brands.length) {
    target.brands.push(createBrand(target.clients[0].id));
  }

  target.clients.forEach((client) => {
    if (!target.brands.some((brand) => brand.clientId === client.id)) {
      target.brands.push(createBrand(client.id, { name: `${client.name} Brand 1` }));
    }
  });

  if (!target.campaigns.length) {
    target.campaigns.push(createCampaign(target.brands[0].id));
  }

  target.brands.forEach((brand) => {
    if (!target.campaigns.some((campaign) => campaign.brandId === brand.id)) {
      target.campaigns.push(createCampaign(brand.id, { name: "Launch Sprint" }));
    }
  });

  if (!target.clients.some((client) => client.id === target.activeClientId)) {
    target.activeClientId = target.clients[0].id;
  }

  const activeClientBrands = target.brands.filter((brand) => brand.clientId === target.activeClientId);
  if (!activeClientBrands.some((brand) => brand.id === target.activeBrandId)) {
    target.activeBrandId = activeClientBrands[0].id;
  }

  const activeBrandCampaigns = target.campaigns.filter((campaign) => campaign.brandId === target.activeBrandId);
  if (!activeBrandCampaigns.some((campaign) => campaign.id === target.activeCampaignId)) {
    target.activeCampaignId = activeBrandCampaigns[0].id;
  }
}

function sanitizeClient(client, index) {
  if (!client || typeof client !== "object") return null;
  return {
    id: client.id || createId("client"),
    name: sanitizeText(client.name, 80, `Client ${index + 1}`)
  };
}

function sanitizeBrand(brand, index, validClientIds) {
  if (!brand || typeof brand !== "object") return null;

  const clientId = validClientIds.includes(brand.clientId) ? brand.clientId : validClientIds[0];
  const sanitized = createBrand(clientId, {
    id: brand.id,
    name: brand.name || brand.brandName,
    tagline: brand.tagline,
    voice: brand.voice,
    palette: brand.palette,
    headingFont: brand.headingFont,
    bodyFont: brand.bodyFont,
    accentFont: brand.accentFont,
    typeScale: brand.typeScale,
    radius: brand.radius,
    gradientAngle: brand.gradientAngle,
    overlayDensity: brand.overlayDensity,
    layoutStyle: brand.layoutStyle,
    imageryFilter: brand.imageryFilter,
    fgIndex: brand.fgIndex,
    bgIndex: brand.bgIndex,
    logos: brand.logos,
    imagery: brand.imagery,
    primaryLogoId: brand.primaryLogoId,
    heroImageId: brand.heroImageId
  });

  if (!sanitized.name) {
    sanitized.name = `Brand ${index + 1}`;
  }

  return sanitized;
}

function sanitizeCampaign(campaign, index, validBrandIds) {
  if (!campaign || typeof campaign !== "object") return null;

  const brandId = validBrandIds.includes(campaign.brandId) ? campaign.brandId : validBrandIds[0];
  const sanitized = createCampaign(brandId, {
    id: campaign.id,
    name: campaign.name,
    objective: campaign.objective,
    audience: campaign.audience,
    channel: campaign.channel,
    message: campaign.message,
    proofPoints: campaign.proofPoints,
    cta: campaign.cta,
    tone: campaign.tone,
    messageAngles: campaign.messageAngles,
    creatives: campaign.creatives
  });

  if (!sanitized.name) {
    sanitized.name = `Campaign ${index + 1}`;
  }

  return sanitized;
}

function createClient(name) {
  return {
    id: createId("client"),
    name: sanitizeText(name, 80, "Untitled Client")
  };
}

function createBrand(clientId, overrides = {}) {
  const logos = normalizeAssets(overrides.logos, "logo");
  const imagery = normalizeAssets(overrides.imagery, "img");

  const brand = {
    id: overrides.id || createId("brand"),
    clientId,
    name: sanitizeText(overrides.name, 80, DEFAULT_BRAND_TEMPLATE.name),
    tagline: sanitizeText(overrides.tagline, 120, DEFAULT_BRAND_TEMPLATE.tagline),
    voice: normalizeVoiceArray(overrides.voice),
    palette: normalizePalette(overrides.palette),
    headingFont: sanitizeFontFamily(overrides.headingFont, DEFAULT_BRAND_TEMPLATE.headingFont),
    bodyFont: sanitizeFontFamily(overrides.bodyFont, DEFAULT_BRAND_TEMPLATE.bodyFont),
    accentFont: sanitizeFontFamily(overrides.accentFont, DEFAULT_BRAND_TEMPLATE.accentFont),
    typeScale: clampInt(overrides.typeScale, 84, 136, DEFAULT_BRAND_TEMPLATE.typeScale),
    radius: clampInt(overrides.radius, 8, 40, DEFAULT_BRAND_TEMPLATE.radius),
    gradientAngle: clampInt(overrides.gradientAngle, 0, 360, DEFAULT_BRAND_TEMPLATE.gradientAngle),
    overlayDensity: clampInt(overrides.overlayDensity, 0, 90, DEFAULT_BRAND_TEMPLATE.overlayDensity),
    layoutStyle: readAllowed(overrides.layoutStyle, ["split", "poster", "focus"], DEFAULT_BRAND_TEMPLATE.layoutStyle),
    imageryFilter: readAllowed(overrides.imageryFilter, ["none", "vivid", "warm", "mono", "grain"], DEFAULT_BRAND_TEMPLATE.imageryFilter),
    fgIndex: clampInt(overrides.fgIndex, 0, 11, DEFAULT_BRAND_TEMPLATE.fgIndex),
    bgIndex: clampInt(overrides.bgIndex, 0, 11, DEFAULT_BRAND_TEMPLATE.bgIndex),
    logos,
    imagery,
    primaryLogoId: overrides.primaryLogoId,
    heroImageId: overrides.heroImageId
  };

  if (!brand.logos.some((asset) => asset.id === brand.primaryLogoId)) {
    brand.primaryLogoId = brand.logos[0] ? brand.logos[0].id : null;
  }

  if (!brand.imagery.some((asset) => asset.id === brand.heroImageId)) {
    brand.heroImageId = brand.imagery[0] ? brand.imagery[0].id : null;
  }

  return brand;
}

function createCampaign(brandId, overrides = {}) {
  return {
    id: overrides.id || createId("campaign"),
    brandId,
    name: sanitizeText(overrides.name, 90, DEFAULT_CAMPAIGN_TEMPLATE.name),
    objective: sanitizeText(overrides.objective, 140, DEFAULT_CAMPAIGN_TEMPLATE.objective),
    audience: sanitizeText(overrides.audience, 140, DEFAULT_CAMPAIGN_TEMPLATE.audience),
    channel: sanitizeText(overrides.channel, 90, DEFAULT_CAMPAIGN_TEMPLATE.channel),
    message: sanitizeText(overrides.message, 400, DEFAULT_CAMPAIGN_TEMPLATE.message),
    proofPoints: normalizeProofPoints(overrides.proofPoints),
    cta: sanitizeText(overrides.cta, 80, DEFAULT_CAMPAIGN_TEMPLATE.cta),
    tone: sanitizeText(overrides.tone, 140, DEFAULT_CAMPAIGN_TEMPLATE.tone),
    messageAngles: normalizeMessageAngles(overrides.messageAngles),
    creatives: normalizeCreatives(overrides.creatives)
  };
}

function createMessageAngle(overrides = {}) {
  return {
    id: overrides.id || createId("angle"),
    segment: sanitizeText(overrides.segment, 90, "Audience segment"),
    angle: sanitizeText(overrides.angle, 140, "Core angle"),
    offer: sanitizeText(overrides.offer, 120, "Proof or offer")
  };
}

function createCreative(overrides = {}) {
  return {
    id: overrides.id || createId("creative"),
    title: sanitizeText(overrides.title, 90, "Untitled Creative"),
    format: readAllowed(overrides.format, CREATIVE_FORMATS, CREATIVE_FORMATS[0]),
    status: readAllowed(overrides.status, CREATIVE_STATUSES, CREATIVE_STATUSES[0]),
    hook: sanitizeText(overrides.hook, 260, "")
  };
}

function normalizeMessageAngles(candidate) {
  if (!Array.isArray(candidate)) {
    return DEFAULT_CAMPAIGN_TEMPLATE.messageAngles.map((angle) => createMessageAngle(angle));
  }

  const rows = candidate.map((angle) => createMessageAngle(angle)).filter(Boolean).slice(0, 12);
  if (!rows.length) {
    return [createMessageAngle()];
  }

  return rows;
}

function normalizeCreatives(candidate) {
  if (!Array.isArray(candidate)) {
    return DEFAULT_CAMPAIGN_TEMPLATE.creatives.map((creative) => createCreative(creative));
  }

  const rows = candidate.map((creative) => createCreative(creative)).filter(Boolean).slice(0, 80);
  if (!rows.length) {
    return [createCreative()];
  }

  return rows;
}

function generateCreativePack(campaign) {
  const objective = shortChip(campaign.objective);
  const message = shortChip(campaign.message);

  return [
    createCreative({
      title: `${objective} Carousel`,
      format: "Carousel",
      status: "Draft",
      hook: `Show a clear 3-step proof path: ${message}.`
    }),
    createCreative({
      title: `${objective} 15s Video`,
      format: "Short Video",
      status: "Draft",
      hook: "Open with the operational pain, resolve with measurable transformation."
    }),
    createCreative({
      title: `${objective} Landing Hero`,
      format: "Landing Hero",
      status: "Draft",
      hook: "Lead headline + proof stack + CTA above fold."
    })
  ];
}

function normalizeAssets(candidate, prefix) {
  if (!Array.isArray(candidate)) return [];

  return candidate
    .map((asset, index) => {
      const name = sanitizeText(asset?.name, 90, `${prefix}-${index + 1}`);
      const url = typeof asset?.url === "string" ? asset.url : "";
      const safe = url.startsWith("data:image/") || url.startsWith("https://") || url.startsWith("http://") || url.startsWith("blob:");
      if (!safe) return null;

      return {
        id: asset?.id || createId(prefix),
        name,
        url
      };
    })
    .filter(Boolean)
    .slice(0, prefix === "logo" ? MAX_LOGOS : MAX_IMAGES);
}

function normalizePalette(candidate) {
  if (!Array.isArray(candidate)) return DEFAULT_BRAND_TEMPLATE.palette.slice();
  const normalized = candidate.map(normalizeHex).filter(Boolean);
  if (normalized.length < 3) return DEFAULT_BRAND_TEMPLATE.palette.slice();
  return normalized.slice(0, 12);
}

function normalizeVoiceArray(candidate) {
  if (!Array.isArray(candidate)) return DEFAULT_BRAND_TEMPLATE.voice.slice();
  const cleaned = candidate
    .map((entry) => sanitizeText(entry, 30, ""))
    .filter(Boolean)
    .slice(0, 8);

  if (!cleaned.length) return DEFAULT_BRAND_TEMPLATE.voice.slice();
  return [...new Set(cleaned)];
}

function normalizeProofPoints(candidate) {
  if (typeof candidate === "string") {
    return parseProofPoints(candidate);
  }

  if (!Array.isArray(candidate)) {
    return DEFAULT_CAMPAIGN_TEMPLATE.proofPoints.slice();
  }

  const cleaned = candidate
    .map((entry) => sanitizeText(entry, 90, ""))
    .filter(Boolean)
    .slice(0, 10);

  if (!cleaned.length) return DEFAULT_CAMPAIGN_TEMPLATE.proofPoints.slice();
  return cleaned;
}

function normalizeFontLibrary(candidate) {
  const input = candidate && typeof candidate === "object" ? candidate : {};

  const googleFamilies = Array.isArray(input.googleFamilies)
    ? [...new Set(input.googleFamilies.map((family) => sanitizeFontFamily(family, "")).filter(Boolean))].slice(0, 100)
    : [];

  const uploadedFonts = Array.isArray(input.uploadedFonts)
    ? input.uploadedFonts
        .map((asset, index) => sanitizeUploadedFontAsset(asset, index))
        .filter(Boolean)
        .slice(0, MAX_UPLOADED_FONTS)
    : [];

  return {
    googleFamilies,
    uploadedFonts
  };
}

function sanitizeFontLibrary(candidate) {
  return normalizeFontLibrary(candidate);
}

function sanitizeUploadedFontAsset(asset, index) {
  if (!asset || typeof asset !== "object") return null;

  const family = sanitizeFontFamily(asset.family, `Uploaded Font ${index + 1}`);
  const format = readAllowed(asset.format, FONT_FORMATS, "woff2");
  const dataUrl = typeof asset.dataUrl === "string" && asset.dataUrl.startsWith("data:") ? asset.dataUrl : "";
  if (!dataUrl) return null;

  return {
    id: asset.id || createId("font"),
    family,
    format,
    dataUrl
  };
}

function getActiveClient() {
  return state.clients.find((client) => client.id === state.activeClientId) || null;
}

function getActiveBrand() {
  return state.brands.find((brand) => brand.id === state.activeBrandId) || null;
}

function getActiveCampaign() {
  return state.campaigns.find((campaign) => campaign.id === state.activeCampaignId) || null;
}

function getBrandsForClient(clientId) {
  return state.brands.filter((brand) => brand.clientId === clientId);
}

function getCampaignsForBrand(brandId) {
  return state.campaigns.filter((campaign) => campaign.brandId === brandId);
}

function getPrimaryLogo() {
  const brand = getActiveBrand();
  if (!brand || !brand.logos.length) return null;
  return brand.logos.find((asset) => asset.id === brand.primaryLogoId) || brand.logos[0];
}

function getHeroImage() {
  const brand = getActiveBrand();
  if (!brand || !brand.imagery.length) return null;
  return brand.imagery.find((asset) => asset.id === brand.heroImageId) || brand.imagery[0];
}

function parseVoice(value) {
  return normalizeVoiceArray(String(value).split(","));
}

function parseProofPoints(value) {
  const rows = String(value)
    .split(/\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);

  return normalizeProofPoints(rows);
}

function buildOptionMarkup(options, selected) {
  return options
    .map((option) => `<option value=\"${option}\" ${option === selected ? "selected" : ""}>${option}</option>`)
    .join("");
}

function setSelectValue(selectElement, value, fallback) {
  const available = Array.from(selectElement.options).map((option) => option.value);
  const effectiveFallback = available.includes(fallback) ? fallback : available[0] || "";
  selectElement.value = available.includes(value) ? value : effectiveFallback;
}

function sanitizeText(value, maxLength, fallback) {
  if (typeof value !== "string") return fallback;
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  return clean.slice(0, maxLength);
}

function sanitizeFontFamily(value, fallback) {
  if (typeof value !== "string") return fallback;
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  return clean.slice(0, 90);
}

function readAllowed(value, allowed, fallback) {
  if (allowed.includes(value)) return value;
  return fallback;
}

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function normalizeHex(value) {
  if (typeof value !== "string") return null;
  let hex = value.trim().replace(/^#/, "").toUpperCase();

  if (/^[0-9A-F]{3}$/.test(hex)) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (!/^[0-9A-F]{6}$/.test(hex)) return null;
  return `#${hex}`;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return { r: 0, g: 0, b: 0 };

  const raw = normalized.slice(1);
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16)
  };
}

function getLuminance({ r, g, b }) {
  const toLinear = (value) => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(colorA, colorB) {
  const lumA = getLuminance(hexToRgb(colorA));
  const lumB = getLuminance(hexToRgb(colorB));
  const light = Math.max(lumA, lumB);
  const dark = Math.min(lumA, lumB);
  return (light + 0.05) / (dark + 0.05);
}

function wrapFont(family) {
  const fallback = SERIF_FONTS.has(family) ? "serif" : "sans-serif";
  return `\"${family}\", ${fallback}`;
}

function shortChip(value) {
  if (typeof value !== "string") return "";
  const clean = value.trim();
  if (!clean) return "";
  if (clean.length <= 32) return clean;
  return `${clean.slice(0, 31)}...`;
}

function getInitials(value) {
  const parts = String(value)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return "AF";
  return parts.map((part) => part[0].toUpperCase()).join("");
}

function generatePaletteColor(index) {
  const hue = Math.round((index * 52 + 26) % 360);
  return hslToHex(hue, 82, 58);
}

function hslToHex(h, s, l) {
  const sat = s / 100;
  const light = l / 100;

  const k = (n) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n) => {
    const color = light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(name) {
  const match = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "";
}

function createId(prefix) {
  const random = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${prefix}-${random}`;
}

function fileToAsset(file, prefix) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: createId(prefix),
        name: sanitizeText(file.name, 90, `${prefix}-asset`),
        url: String(reader.result)
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function copyToClipboard(text) {
  if (!navigator.clipboard?.writeText) {
    return Promise.reject(new Error("Clipboard API unavailable"));
  }
  return navigator.clipboard.writeText(text);
}

function downloadText(fileName, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function setStatus(message, tone = "info") {
  el.statusMessage.textContent = message;
  if (tone === "error") {
    el.statusMessage.style.color = "#b91c1c";
    return;
  }

  if (tone === "warn") {
    el.statusMessage.style.color = "#9a5800";
    return;
  }

  el.statusMessage.style.color = "var(--ui-ink-muted)";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
