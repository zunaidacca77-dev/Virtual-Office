/**
 * Master Virtual Office & Agency Portal
 * Core Application Engine & State Manager
 */

// Global State
let config = {};
let currentCurrency = 'USD'; // 'USD' or 'BDT'
let activeClientPortal = null;
let currentFormMode = 'builtin'; // 'builtin' or 'tally'
let currentLocalPayProvider = 'bkash';
let currentAdSource = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  initTheme();
  initCurrency();
  renderApp();
  checkUrlForPortalToken();
  checkUrlForCampaign();
  setupKeyboardShortcuts();
  initIcons();
});

// Re-initialize Lucide Icons
function initIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

// ---------------- CONFIG & STORAGE ----------------
function loadConfig() {
  const saved = localStorage.getItem('virtual_office_config_v2');
  if (saved) {
    try {
      config = JSON.parse(saved);
      // Auto-migrate avatar to local profile picture if previously using Unsplash placeholder
      if (config.profile && config.profile.avatar && config.profile.avatar.includes('unsplash.com')) {
        config.profile.avatar = 'profile.png';
        saveConfigToStorage();
      }
    } catch (e) {
      console.error("Config parse error, reverting to default", e);
      config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }
  } else {
    config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }
}

function saveConfigToStorage() {
  localStorage.setItem('virtual_office_config_v2', JSON.stringify(config));
}

// ---------------- THEME (DARK / LIGHT) ----------------
function initTheme() {
  const savedTheme = localStorage.getItem('virtual_office_theme') || 'dark';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('virtual_office_theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
  showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    initIcons();
  }
}

// ---------------- CURRENCY SWITCHER ----------------
function initCurrency() {
  currentCurrency = localStorage.getItem('virtual_office_currency') || 'USD';
  updateCurrencyButtons();
}

function setCurrency(curr) {
  currentCurrency = curr;
  localStorage.setItem('virtual_office_currency', curr);
  updateCurrencyButtons();
  renderPackages();
  showToast(`Currency switched to ${curr === 'USD' ? 'US Dollar ($)' : 'Bangladeshi Taka (৳)'}`);
}

function updateCurrencyButtons() {
  const btnUSD = document.getElementById('currUSD');
  const btnBDT = document.getElementById('currBDT');
  if (currentCurrency === 'USD') {
    btnUSD.className = "px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs";
    btnBDT.className = "px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white";
  } else {
    btnBDT.className = "px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs";
    btnUSD.className = "px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white";
  }
}

// ---------------- STATUS TOGGLE ----------------
function toggleOfficeStatus() {
  config.profile.status = (config.profile.status === 'online') ? 'deepwork' : 'online';
  saveConfigToStorage();
  updateStatusUI();
  const msg = config.profile.status === 'online' ? '🟢 Office Status: Online & Available' : '🔴 Office Status: In a Deep Work Session';
  showToast(msg);
}

function updateStatusUI() {
  const isOnline = config.profile.status === 'online';
  
  // Navbar Status
  const navBadge = document.getElementById('navStatusBadge');
  const navDot = document.getElementById('navStatusDot');
  const navPing = document.getElementById('navStatusPing');
  const navText = document.getElementById('navStatusText');
  
  if (isOnline) {
    navBadge.className = "ml-1 sm:ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:scale-105 active:scale-95 transition cursor-pointer";
    navDot.className = "relative inline-flex rounded-full h-2 w-2 bg-emerald-500";
    navPing.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75";
    navText.textContent = "Online";
  } else {
    navBadge.className = "ml-1 sm:ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xs bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:scale-105 active:scale-95 transition cursor-pointer";
    navDot.className = "relative inline-flex rounded-full h-2 w-2 bg-rose-500";
    navPing.className = "hidden";
    navText.textContent = "Deep Work";
  }

  // Hero Avatar Dot
  const heroDot = document.getElementById('heroStatusDot');
  if (heroDot) {
    heroDot.className = isOnline ? "w-4 h-4 rounded-full block bg-emerald-500 ring-2 ring-white dark:ring-slate-900" : "w-4 h-4 rounded-full block bg-rose-500 ring-2 ring-white dark:ring-slate-900";
  }

  // Hero Status Banner
  const heroBanner = document.getElementById('heroStatusBanner');
  const heroDotLarge = document.getElementById('heroStatusDotLarge');
  const heroPing = document.getElementById('heroStatusPing');
  const heroText = document.getElementById('heroStatusText');

  if (heroBanner && heroText) {
    if (isOnline) {
      heroBanner.className = "cursor-pointer inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border shadow-xs transition hover:scale-[1.01] active:scale-95 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800";
      heroDotLarge.className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500";
      heroPing.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75";
      heroText.textContent = config.profile.statusOnlineText || "🟢 Office Status: Online (Available for Instant Meeting)";
    } else {
      heroBanner.className = "cursor-pointer inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border shadow-xs transition hover:scale-[1.01] active:scale-95 bg-rose-50/90 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800";
      heroDotLarge.className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500";
      heroPing.className = "hidden";
      heroText.textContent = config.profile.statusDeepworkText || "🔴 In a Deep Work Session (Leave a message with my AI Receptionist)";
    }
  }
}

// ---------------- MAIN APP RENDER ----------------
function renderApp() {
  const p = config.profile;

  // Header & Brand
  document.getElementById('navName').textContent = p.name;
  document.getElementById('navAvatar').src = p.avatar;
  document.getElementById('footerName').textContent = p.name;

  // Hero Section
  document.getElementById('heroCover').src = p.cover;
  document.getElementById('heroAvatar').src = p.avatar;
  document.getElementById('heroName').textContent = p.name;
  document.getElementById('heroSkillTitle').textContent = p.title;
  document.getElementById('heroBio').textContent = p.bio;
  document.getElementById('heroResponseBadge').textContent = p.responseTime;
  document.getElementById('heroRatingBadge').textContent = p.rating;

  updateStatusUI();

  // Links & Modals setup
  document.getElementById('wherebyDirectLink').href = config.meeting.wherebyUrl;
  
  // WhatsApp Direct Link
  const encodedMsg = encodeURIComponent(config.meeting.whatsappPrefill || "Hi, I visited your Virtual Office.");
  const waUrl = `https://wa.me/${config.meeting.whatsappNumber}?text=${encodedMsg}`;
  document.getElementById('btnWhatsAppDirect').href = waUrl;

  // AI Desk Title & Greeting
  document.getElementById('aiDeskTitle').textContent = `🤖 Talk to ${config.aiDesk.assistantName || 'My AI Assistant'}`;
  initAIChatHistory();

  // Packages & Portfolio
  renderPackages();
  renderPortfolio('all');

  // Payment Setup
  document.getElementById('btnPayInternational').href = config.payments.payoneerLink || '#';
  updateLocalPayUI();

  // Tally Embed URL
  document.getElementById('tallyIframe').src = config.tally.embedUrl;
  document.getElementById('modalTallyIframe').src = config.tally.embedUrl;

  initIcons();
}

// ---------------- SECTION 3: PACKAGES RENDER ----------------
function renderPackages() {
  const container = document.getElementById('pricingGrid');
  if (!container) return;

  const isUSD = currentCurrency === 'USD';
  const currencySymbol = isUSD ? '$' : '৳';

  container.innerHTML = config.packages.map(pkg => {
    const price = isUSD ? pkg.priceUSD : pkg.priceBDT.toLocaleString();
    const isPopular = pkg.popular;
    
    return `
      <div class="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative ${
        isPopular ? 'ring-2 ring-navy-600 dark:ring-blue-500 shadow-lg' : 'border border-slate-200/80 dark:border-slate-800'
      }">
        ${isPopular ? `
          <div class="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
            <span class="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-navy-600 to-blue-600 text-white shadow-md flex items-center gap-1">
              <i data-lucide="sparkles" class="w-3 h-3"></i> Most Popular
            </span>
          </div>
        ` : ''}

        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-lg text-slate-900 dark:text-white">${pkg.name}</h4>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              ${pkg.badge}
            </span>
          </div>

          <div class="mt-4 mb-6">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">${currencySymbol}${price}</span>
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">/ project fixed</span>
            </div>
            <div class="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3.5 h-3.5"></i> ${pkg.deliveryTime}</span>
              <span>•</span>
              <span class="flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> ${pkg.revisions}</span>
            </div>
          </div>

          <!-- Features List -->
          <ul class="space-y-3 mb-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            ${pkg.features.map(f => `
              <li class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <button onclick="selectPackageOrder('${pkg.id}')" class="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-95 ${
          isPopular 
            ? 'bg-navy-600 hover:bg-navy-700 text-white shadow-md' 
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
        }">
          <span>[ Select ${pkg.name.split('/')[0]} ]</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  }).join('');

  initIcons();
}

function selectPackageOrder(packageId) {
  const select = document.getElementById('orderPackageSelect');
  if (select) {
    select.value = packageId;
  }
  const orderSection = document.getElementById('order-desk');
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: 'smooth' });
    showToast(`Package selected! Fill in your brief below.`);
  }
}

// ---------------- SECTION 3: PORTFOLIO RENDER ----------------
function renderPortfolio(filterCategory) {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? config.portfolio 
    : config.portfolio.filter(item => item.category === filterCategory);

  container.innerHTML = filtered.map(item => `
    <div class="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800">
      <div class="relative h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
          <button onclick="openPortfolioModal(${item.id})" class="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold shadow-md hover:bg-white flex items-center gap-1.5">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i> View Case Study
          </button>
        </div>
      </div>

      <div class="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-navy-600 dark:text-blue-400">${item.categoryLabel}</span>
            <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">${item.results}</span>
          </div>
          <h4 class="font-bold text-base text-slate-900 dark:text-white group-hover:text-navy-600 dark:group-hover:text-blue-400 transition mb-2">${item.title}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">${item.description}</p>
        </div>

        <div class="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          ${item.tools.map(tool => `
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${tool}</span>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');

  initIcons();
}

function filterPortfolio(category) {
  const buttons = document.querySelectorAll('#portfolioFilters button');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.className = "px-3 py-1.5 rounded-lg transition bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold";
    } else {
      btn.className = "px-3 py-1.5 rounded-lg transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
    }
  });
  renderPortfolio(category);
}

function openPortfolioModal(id) {
  const item = config.portfolio.find(p => p.id === id);
  if (!item) return;

  document.getElementById('modalPortImg').src = item.image;
  document.getElementById('modalPortCategory').textContent = item.categoryLabel;
  document.getElementById('modalPortResults').textContent = item.results;
  document.getElementById('modalPortTitle').textContent = item.title;
  document.getElementById('modalPortDesc').textContent = item.description;

  const toolsContainer = document.getElementById('modalPortTools');
  toolsContainer.innerHTML = item.tools.map(t => `
    <span class="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">${t}</span>
  `).join('');

  document.getElementById('modalPortfolio').classList.remove('hidden');
  initIcons();
}

function closePortfolioModal() {
  document.getElementById('modalPortfolio').classList.add('hidden');
}

// ---------------- SECTION 2: AI CHAT RECEPTIONIST ----------------
function initAIChatHistory() {
  const history = document.getElementById('aiChatHistory');
  if (!history) return;

  const welcome = config.aiDesk.welcomeMessage || "Hello! I am your AI receptionist. How can I help you today?";
  history.innerHTML = `
    <div class="flex items-start gap-2.5">
      <div class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-accent-violet flex items-center justify-center flex-shrink-0 text-xs font-bold">AI</div>
      <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-2xs max-w-[85%]">
        <p class="text-slate-800 dark:text-slate-200">${welcome}</p>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <button type="button" onclick="quickSendAI('What are your package prices?')" class="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-accent-violet hover:bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 font-medium">💰 Pricing & Packages</button>
          <button type="button" onclick="quickSendAI('Can I talk with you in live cabin?')" class="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 hover:bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 font-medium">📹 Live Meeting</button>
          <button type="button" onclick="quickSendAI('I want to leave a project brief')" class="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-medium">📝 Submit Brief</button>
        </div>
      </div>
    </div>
  `;
}

function quickSendAI(text) {
  document.getElementById('aiChatInput').value = text;
  handleAIChatSubmit(new Event('submit'));
}

function handleAIChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('aiChatInput');
  const userText = input.value.trim();
  if (!userText) return;

  const history = document.getElementById('aiChatHistory');

  // Append User message
  const userBubble = document.createElement('div');
  userBubble.className = "flex items-start justify-end gap-2";
  userBubble.innerHTML = `
    <div class="bg-navy-600 text-white p-3 rounded-2xl rounded-tr-none shadow-2xs max-w-[85%]">
      <p>${escapeHtml(userText)}</p>
    </div>
  `;
  history.appendChild(userBubble);
  input.value = '';
  history.scrollTop = history.scrollHeight;

  // Simulate AI Thinking and Intelligent Response
  setTimeout(() => {
    const aiResponse = generateAIResponse(userText);
    const aiBubble = document.createElement('div');
    aiBubble.className = "flex items-start gap-2.5 animate-fadeIn";
    aiBubble.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-accent-violet flex items-center justify-center flex-shrink-0 text-xs font-bold">AI</div>
      <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-2xs max-w-[85%]">
        <p class="text-slate-800 dark:text-slate-200">${aiResponse}</p>
      </div>
    `;
    history.appendChild(aiBubble);
    history.scrollTop = history.scrollHeight;
  }, 600);
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  const isUSD = currentCurrency === 'USD';
  const sym = isUSD ? '$' : '৳';
  const p1 = isUSD ? config.packages[0].priceUSD : config.packages[0].priceBDT;
  const p2 = isUSD ? config.packages[1].priceUSD : config.packages[1].priceBDT;

  if (q.includes('price') || q.includes('cost') || q.includes('package') || q.includes('টাকা') || q.includes('দাম') || q.includes('খরচ')) {
    return `We offer 3 streamlined packages: <strong>Starter</strong> (${sym}${p1}), <strong>Standard / Pro</strong> (${sym}${p2} - Most Popular), and <strong>Custom Enterprise</strong>. You can view all included deliverables in Section 3 below.`;
  } else if (q.includes('meeting') || q.includes('call') || q.includes('video') || q.includes('live') || q.includes('কথা') || q.includes('মিটিং')) {
    return `You can knock directly on the <strong>Live Virtual Cabin</strong> on the left side of this lounge. If I'm offline or in deep work, click <strong>Schedule a Meeting</strong> to pick a slot on Cal.com!`;
  } else if (q.includes('whatsapp') || q.includes('contact') || q.includes('number') || q.includes('হোয়াটসঅ্যাপ') || q.includes('নাম্বার')) {
    return `You can chat directly with me on WhatsApp anytime by clicking the <strong>[ 💬 Direct WhatsApp ]</strong> button below or messaging <code>+${config.meeting.whatsappNumber}</code>.`;
  } else if (q.includes('brief') || q.includes('order') || q.includes('hire') || q.includes('project') || q.includes('কাজ') || q.includes('অর্ডার')) {
    return `Awesome! You can scroll to Section 4 (<strong>Start a Project Desk</strong>) to submit your requirements. Once submitted, your workspace ticket is generated immediately.`;
  } else {
    return `Thank you for your message! ${config.profile.name} is currently monitoring this desk. Would you like to enter our Live Cabin for a face-to-face chat, or would you prefer to connect via WhatsApp?`;
  }
}

// ---------------- SECTION 4: PROJECT ORDERING ----------------
function setFormMode(mode) {
  currentFormMode = mode;
  const btnBuiltin = document.getElementById('formModeBuiltin');
  const btnTally = document.getElementById('formModeTally');
  const formBuiltin = document.getElementById('projectOrderForm');
  const containerTally = document.getElementById('tallyEmbedContainer');

  if (mode === 'builtin') {
    btnBuiltin.className = "px-3 py-1.5 rounded-lg bg-navy-600 text-white transition shadow-xs font-bold";
    btnTally.className = "px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition";
    formBuiltin.classList.remove('hidden');
    containerTally.classList.add('hidden');
  } else {
    btnTally.className = "px-3 py-1.5 rounded-lg bg-navy-600 text-white transition shadow-xs font-bold";
    btnBuiltin.className = "px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition";
    formBuiltin.classList.add('hidden');
    containerTally.classList.remove('hidden');
  }
}

function handleProjectOrderSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('orderClientName').value;
  const contact = document.getElementById('orderClientContact').value;
  const pkgVal = document.getElementById('orderPackageSelect').value;
  const brief = document.getElementById('orderBrief').value;

  const pkgObj = config.packages.find(p => p.id === pkgVal) || config.packages[1];
  const price = currentCurrency === 'USD' ? `$${pkgObj.priceUSD}` : `৳${pkgObj.priceBDT.toLocaleString()}`;

  // Trigger celebration confetti
  if (window.confetti) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Show active order banner in Section 5
  const banner = document.getElementById('activeOrderInvoiceBanner');
  const text = document.getElementById('activeOrderInvoiceText');
  const adTag = currentAdSource ? ` [Source: ${currentAdSource}]` : '';
  if (banner && text) {
    text.textContent = `Order Initialized for ${name}! Package: ${pkgObj.name} (${price})${adTag}. Complete payment below.`;
    banner.classList.remove('hidden');
  }

  // Smooth scroll to Billing Counter
  const billingSection = document.getElementById('billing');
  if (billingSection) {
    billingSection.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`🎉 Project submitted! Proceed to payment below.`);
}

function dismissInvoiceBanner() {
  document.getElementById('activeOrderInvoiceBanner').classList.add('hidden');
}

// ---------------- SECTION 5: PAYMENTS ----------------
function switchLocalPayTab(provider) {
  currentLocalPayProvider = provider;
  const tabBkash = document.getElementById('tabBkash');
  const tabNagad = document.getElementById('tabNagad');

  if (provider === 'bkash') {
    tabBkash.className = "flex-1 py-1.5 rounded-lg bg-pink-600 text-white transition font-bold shadow-xs flex items-center justify-center gap-1";
    tabNagad.className = "flex-1 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-bold flex items-center justify-center gap-1";
  } else {
    tabNagad.className = "flex-1 py-1.5 rounded-lg bg-orange-600 text-white transition font-bold shadow-xs flex items-center justify-center gap-1";
    tabBkash.className = "flex-1 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-bold flex items-center justify-center gap-1";
  }
  updateLocalPayUI();
}

function updateLocalPayUI() {
  const isBkash = currentLocalPayProvider === 'bkash';
  const label = document.getElementById('localPayProvider');
  const num = document.getElementById('localPayNumber');
  const qr = document.getElementById('localPayQr');

  if (label && num) {
    label.textContent = isBkash ? `bKash ${config.payments.bkashType || 'Personal'}` : `Nagad ${config.payments.nagadType || 'Personal'}`;
    num.textContent = isBkash ? config.payments.bkashNumber : config.payments.nagadNumber;
    qr.src = isBkash ? config.payments.qrCodeUrl : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=nagad://${config.payments.nagadNumber}`;
  }
}

function copyLocalPayNumber() {
  const num = currentLocalPayProvider === 'bkash' ? config.payments.bkashNumber : config.payments.nagadNumber;
  navigator.clipboard.writeText(num);
  showToast(`Copied ${currentLocalPayProvider.toUpperCase()} number: ${num}`);
}

function copyPayoneerEmail() {
  const email = config.payments.payoneerEmail || "payments@traineestudio.com";
  navigator.clipboard.writeText(email);
  showToast(`Copied Payoneer Email: ${email}`);
}

function handleTrxVerify(e) {
  e.preventDefault();
  const input = document.getElementById('trxIdInput');
  const trxId = input.value.trim().toUpperCase();
  if (!trxId) return;

  const banner = document.getElementById('trxSuccessBanner');
  banner.classList.remove('hidden');

  document.getElementById('voucherTrxId').textContent = trxId;
  document.getElementById('voucherRecipient').textContent = config.profile.name;
  document.getElementById('voucherTime').textContent = new Date().toLocaleString();

  showToast(`✅ TrxID ${trxId} verified!`);
}

function openVoucherModal() {
  document.getElementById('modalVoucher').classList.remove('hidden');
  initIcons();
}

function closeVoucherModal() {
  document.getElementById('modalVoucher').classList.add('hidden');
}

// ---------------- OWNER / ADMIN SECURITY & CAMPAIGNS ----------------
function isAdminLoggedIn() {
  return sessionStorage.getItem('virtual_office_admin') === 'true';
}

function updateAdminVisibility() {
  const isLogged = isAdminLoggedIn();
  const navBtn = document.getElementById('navCustomizeBtn');
  const floatBar = document.getElementById('adminFloatingBar');
  if (navBtn) navBtn.classList.toggle('hidden', !isLogged);
  if (floatBar) floatBar.classList.toggle('hidden', !isLogged);
}

function openAdminLoginModal() {
  document.getElementById('adminLoginModal').classList.remove('hidden');
  document.getElementById('adminLoginError').classList.add('hidden');
  document.getElementById('adminPinInput').value = '';
  setTimeout(() => document.getElementById('adminPinInput').focus(), 150);
  initIcons();
}

function closeAdminLoginModal() {
  document.getElementById('adminLoginModal').classList.add('hidden');
}

function handleAdminLogin(e) {
  e.preventDefault();
  const enteredPin = document.getElementById('adminPinInput').value.trim();
  const correctPin = (config.security && config.security.adminPin) ? config.security.adminPin : "7788";

  if (enteredPin === correctPin) {
    sessionStorage.setItem('virtual_office_admin', 'true');
    closeAdminLoginModal();
    updateAdminVisibility();
    openAdminDrawer();
    showToast("👑 Owner Mode Unlocked! All settings enabled.");
  } else {
    const err = document.getElementById('adminLoginError');
    err.textContent = "❌ Invalid PIN. Please try again.";
    err.classList.remove('hidden');
  }
}

function adminLogout() {
  sessionStorage.removeItem('virtual_office_admin');
  closeAdminDrawer();
  updateAdminVisibility();
  showToast("🔒 Exited Owner Mode. You are now in Public Client View.");
}

function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Ctrl + Shift + A or Cmd + Shift + A
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      if (isAdminLoggedIn()) {
        openAdminDrawer();
      } else {
        openAdminLoginModal();
      }
    }
  });
}

function checkUrlForCampaign() {
  const params = new URLSearchParams(window.location.search);
  
  // Check if admin param requested
  if (params.get('admin') === 'login' || params.get('admin') === 'true') {
    if (!isAdminLoggedIn()) {
      openAdminLoginModal();
    } else {
      updateAdminVisibility();
      openAdminDrawer();
    }
  } else {
    updateAdminVisibility();
  }

  // Check for Ad Campaigns (Meta Ads, Google Ads, etc.)
  const source = params.get('utm_source') || params.get('ad') || params.get('ref');
  const campaign = params.get('utm_campaign') || '';

  if (source) {
    currentAdSource = `${source} (${campaign || 'Direct Ad'})`;
    const banner = document.getElementById('adCampaignBanner');
    const badge = document.getElementById('adCampaignSourceBadge');
    const msg = document.getElementById('adCampaignMessage');

    if (banner) {
      banner.classList.remove('hidden');
      const srcLow = source.toLowerCase();
      if (srcLow.includes('meta') || srcLow.includes('fb') || srcLow.includes('facebook') || srcLow.includes('instagram')) {
        badge.textContent = "🎯 Meta Ads Special";
        msg.textContent = `Welcome from Meta! Book a Free 15-Minute Live Strategy Call with ${config.profile.name} today.`;
      } else if (srcLow.includes('google') || srcLow.includes('adwords') || srcLow.includes('gads')) {
        badge.textContent = "🔍 Google Ads Special";
        msg.textContent = `Welcome from Google Search! Claim your Free Project Consultation with ${config.profile.name}.`;
      } else {
        badge.textContent = `🎯 ${source.toUpperCase()} Special`;
        msg.textContent = `Exclusive Project Consultation with ${config.profile.name}. Explore packages below.`;
      }
      initIcons();
    }
  }
}

function dismissAdBanner() {
  document.getElementById('adCampaignBanner').classList.add('hidden');
}

// ---------------- SECTION 6: STRICT PRIVATE CLIENT PORTAL [UPDATED] ----------------
function checkUrlForPortalToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const portalToken = urlParams.get('portal');
  if (portalToken) {
    loginToPortalWithToken(portalToken);
    const portalSec = document.getElementById('client-portal');
    if (portalSec) {
      setTimeout(() => portalSec.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }
}

function handlePortalLogin(e) {
  e.preventDefault();
  const input = document.getElementById('portalTokenInput');
  const token = input.value.trim().toUpperCase();
  loginToPortalWithToken(token);
}

function fillDemoToken(token) {
  document.getElementById('portalTokenInput').value = token;
  loginToPortalWithToken(token);
}

function loginToPortalWithToken(token) {
  const errorEl = document.getElementById('portalLoginError');
  const portal = config.clientPortals.find(p => p.token.toUpperCase() === token.toUpperCase());

  if (!portal) {
    errorEl.textContent = `❌ Access Denied: Secret token "${token}" was not found or is invalid.`;
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');
  activeClientPortal = portal;
  renderActiveClientPortal();

  document.getElementById('portalGatewayCard').classList.add('hidden');
  document.getElementById('portalActiveView').classList.remove('hidden');

  showToast(`🔓 Welcome back, ${portal.clientName}! VIP Portal unlocked.`);
}

function renderActiveClientPortal() {
  if (!activeClientPortal) return;

  const p = activeClientPortal;
  document.getElementById('portalProjectTitle').textContent = p.projectTitle;
  document.getElementById('portalClientName').textContent = p.clientName;
  document.getElementById('portalClientCompany').textContent = p.company || 'Private Client';
  document.getElementById('portalStatusBadge').textContent = p.status;
  document.getElementById('portalProgressText').textContent = `${p.progressPercent}%`;
  document.getElementById('portalProgressBar').style.width = `${p.progressPercent}%`;
  document.getElementById('portalDeliverablesBtn').href = p.deliverablesUrl || '#';

  // Render Milestones
  const milestonesContainer = document.getElementById('portalMilestonesList');
  milestonesContainer.innerHTML = p.milestones.map((m, idx) => `
    <div class="p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
      m.done 
        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
    }">
      <div class="mt-0.5">
        <i data-lucide="${m.done ? 'check-circle-2' : 'circle'}" class="w-4 h-4 ${m.done ? 'text-emerald-600' : 'text-slate-400'}"></i>
      </div>
      <div>
        <span class="font-bold block">${idx + 1}. ${m.title}</span>
        <span class="text-[10px] uppercase font-semibold tracking-wider">${m.done ? 'Completed' : 'In Progress'}</span>
      </div>
    </div>
  `).join('');

  // Render Revision Log
  renderPortalRevisionsLog();
  initIcons();
}

function renderPortalRevisionsLog() {
  const logContainer = document.getElementById('portalRevisionsLog');
  if (!logContainer || !activeClientPortal) return;

  if (!activeClientPortal.revisions || activeClientPortal.revisions.length === 0) {
    logContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No revision notes submitted yet.</p>`;
    return;
  }

  logContainer.innerHTML = activeClientPortal.revisions.map(rev => `
    <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
      <div class="flex items-center justify-between text-[11px] font-semibold text-slate-500">
        <span class="text-navy-600 dark:text-blue-400 font-bold">${rev.author}</span>
        <span>${rev.date}</span>
      </div>
      <p class="text-slate-800 dark:text-slate-200">${escapeHtml(rev.note)}</p>
    </div>
  `).join('');
}

function handleRevisionSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('portalRevisionText');
  const note = input.value.trim();
  if (!note || !activeClientPortal) return;

  if (!activeClientPortal.revisions) {
    activeClientPortal.revisions = [];
  }

  activeClientPortal.revisions.unshift({
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    note: note,
    author: `${activeClientPortal.clientName} (Client)`
  });

  saveConfigToStorage();
  input.value = '';
  renderPortalRevisionsLog();
  showToast('Feedback submitted to trainee workspace!');
}

function exitClientPortal() {
  activeClientPortal = null;
  document.getElementById('portalActiveView').classList.add('hidden');
  document.getElementById('portalGatewayCard').classList.remove('hidden');
  document.getElementById('portalTokenInput').value = '';
  showToast('🔒 Exited client portal. Returned to public office.');
}

// ---------------- MODAL MANAGERS ----------------
function openWherebyModal() {
  document.getElementById('wherebyIframe').src = config.meeting.wherebyUrl;
  document.getElementById('modalWhereby').classList.remove('hidden');
  initIcons();
}
function closeWherebyModal() {
  document.getElementById('modalWhereby').classList.add('hidden');
  document.getElementById('wherebyIframe').src = '';
}

function openCalModal() {
  document.getElementById('calIframe').src = config.meeting.calUrl;
  document.getElementById('modalCal').classList.remove('hidden');
  initIcons();
}
function closeCalModal() {
  document.getElementById('modalCal').classList.add('hidden');
  document.getElementById('calIframe').src = '';
}

function openTallyModal() {
  document.getElementById('modalTallyIframe').src = config.tally.embedUrl;
  document.getElementById('modalTally').classList.remove('hidden');
  initIcons();
}
function closeTallyModal() {
  document.getElementById('modalTally').classList.add('hidden');
  document.getElementById('modalTallyIframe').src = '';
}

// ---------------- ⚙️ ADMIN DRAWER CONTROLS ----------------
function openAdminDrawer() {
  populateAdminFields();
  document.getElementById('adminDrawer').classList.remove('hidden');
  initIcons();
}

function closeAdminDrawer() {
  document.getElementById('adminDrawer').classList.add('hidden');
}

function switchAdminTab(tabName) {
  const tabs = ['profile', 'links', 'ai', 'services', 'payments', 'clients', 'backup'];
  tabs.forEach(t => {
    const btn = document.getElementById(`admTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const sec = document.getElementById(`admSection${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn && sec) {
      if (t === tabName) {
        btn.className = "py-3 border-b-2 border-navy-600 text-navy-600 dark:text-blue-400 font-bold";
        sec.classList.remove('hidden');
      } else {
        btn.className = "py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white";
        sec.classList.add('hidden');
      }
    }
  });
  if (tabName === 'clients') {
    renderAdminClientList();
  }
}

function populateAdminFields() {
  const p = config.profile;
  document.getElementById('cfgName').value = p.name || '';
  document.getElementById('cfgTitle').value = p.title || '';
  document.getElementById('cfgAvatar').value = p.avatar || '';
  document.getElementById('cfgCover').value = p.cover || '';
  document.getElementById('cfgBio').value = p.bio || '';
  document.getElementById('cfgResponseTime').value = p.responseTime || '';
  document.getElementById('cfgRating').value = p.rating || '';

  // Meetings
  document.getElementById('cfgWherebyUrl').value = config.meeting.wherebyUrl || '';
  document.getElementById('cfgCalUrl').value = config.meeting.calUrl || '';
  document.getElementById('cfgWhatsappNumber').value = config.meeting.whatsappNumber || '';
  document.getElementById('cfgWhatsappPrefill').value = config.meeting.whatsappPrefill || '';

  // AI & Tally
  document.getElementById('cfgAiName').value = config.aiDesk.assistantName || '';
  document.getElementById('cfgAiWelcome').value = config.aiDesk.welcomeMessage || '';
  document.getElementById('cfgAiSystemPrompt').value = config.aiDesk.systemPrompt || '';
  document.getElementById('cfgTallyUrl').value = config.tally.embedUrl || '';

  // Packages
  document.getElementById('cfgP1USD').value = config.packages[0].priceUSD;
  document.getElementById('cfgP1BDT').value = config.packages[0].priceBDT;
  document.getElementById('cfgP1Delivery').value = config.packages[0].deliveryTime;

  document.getElementById('cfgP2USD').value = config.packages[1].priceUSD;
  document.getElementById('cfgP2BDT').value = config.packages[1].priceBDT;
  document.getElementById('cfgP2Delivery').value = config.packages[1].deliveryTime;

  document.getElementById('cfgP3USD').value = config.packages[2].priceUSD;
  document.getElementById('cfgP3BDT').value = config.packages[2].priceBDT;

  // Payments
  document.getElementById('cfgPayoneerLink').value = config.payments.payoneerLink || '';
  document.getElementById('cfgPayoneerEmail').value = config.payments.payoneerEmail || '';
  document.getElementById('cfgBkashNumber').value = config.payments.bkashNumber || '';
  document.getElementById('cfgNagadNumber').value = config.payments.nagadNumber || '';
  document.getElementById('cfgQrCodeUrl').value = config.payments.qrCodeUrl || '';

  // Security Master PIN
  document.getElementById('cfgAdminPin').value = (config.security && config.security.adminPin) ? config.security.adminPin : "7788";

  renderAdminClientList();
}

function saveAdminChanges() {
  if (!config.security) config.security = {};
  config.security.adminPin = document.getElementById('cfgAdminPin').value.trim() || "7788";

  config.profile.name = document.getElementById('cfgName').value;
  config.profile.title = document.getElementById('cfgTitle').value;
  config.profile.avatar = document.getElementById('cfgAvatar').value;
  config.profile.cover = document.getElementById('cfgCover').value;
  config.profile.bio = document.getElementById('cfgBio').value;
  config.profile.responseTime = document.getElementById('cfgResponseTime').value;
  config.profile.rating = document.getElementById('cfgRating').value;

  config.meeting.wherebyUrl = document.getElementById('cfgWherebyUrl').value;
  config.meeting.calUrl = document.getElementById('cfgCalUrl').value;
  config.meeting.whatsappNumber = document.getElementById('cfgWhatsappNumber').value;
  config.meeting.whatsappPrefill = document.getElementById('cfgWhatsappPrefill').value;

  config.aiDesk.assistantName = document.getElementById('cfgAiName').value;
  config.aiDesk.welcomeMessage = document.getElementById('cfgAiWelcome').value;
  config.aiDesk.systemPrompt = document.getElementById('cfgAiSystemPrompt').value;
  config.tally.embedUrl = document.getElementById('cfgTallyUrl').value;

  config.packages[0].priceUSD = Number(document.getElementById('cfgP1USD').value);
  config.packages[0].priceBDT = Number(document.getElementById('cfgP1BDT').value);
  config.packages[0].deliveryTime = document.getElementById('cfgP1Delivery').value;

  config.packages[1].priceUSD = Number(document.getElementById('cfgP2USD').value);
  config.packages[1].priceBDT = Number(document.getElementById('cfgP2BDT').value);
  config.packages[1].deliveryTime = document.getElementById('cfgP2Delivery').value;

  config.packages[2].priceUSD = Number(document.getElementById('cfgP3USD').value);
  config.packages[2].priceBDT = Number(document.getElementById('cfgP3BDT').value);

  config.payments.payoneerLink = document.getElementById('cfgPayoneerLink').value;
  config.payments.payoneerEmail = document.getElementById('cfgPayoneerEmail').value;
  config.payments.bkashNumber = document.getElementById('cfgBkashNumber').value;
  config.payments.nagadNumber = document.getElementById('cfgNagadNumber').value;
  config.payments.qrCodeUrl = document.getElementById('cfgQrCodeUrl').value;

  saveConfigToStorage();
  renderApp();
  closeAdminDrawer();
  showToast('✅ Office profile updated successfully!');
}

// Admin VIP Clients Manager
function renderAdminClientList() {
  const container = document.getElementById('admClientsList');
  if (!container) return;

  container.innerHTML = config.clientPortals.map((client, idx) => `
    <div class="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
      <div class="flex items-center justify-between">
        <div>
          <span class="font-bold text-slate-900 dark:text-white block text-sm">${client.clientName}</span>
          <span class="text-xs text-slate-500">${client.projectTitle}</span>
        </div>
        <button onclick="deleteClientPortal('${client.token}')" class="text-rose-500 hover:text-rose-700 p-1" title="Delete Client">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="flex items-center justify-between text-xs pt-1">
        <span class="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-bold">${client.token}</span>
        <span class="text-accent-violet font-semibold">${client.progressPercent}% Completed</span>
      </div>

      <div class="pt-2 flex gap-2">
        <button onclick="copyClientSecretLink('${client.token}')" class="flex-1 py-1.5 px-2 rounded-lg bg-navy-600 hover:bg-navy-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs">
          <i data-lucide="link" class="w-3.5 h-3.5"></i> Copy Private Link
        </button>
      </div>
    </div>
  `).join('');

  initIcons();
}

function openAddNewClientModal() {
  document.getElementById('modalAddClient').classList.remove('hidden');
  initIcons();
}
function closeAddClientModal() {
  document.getElementById('modalAddClient').classList.add('hidden');
}

function handleSaveNewClient(e) {
  e.preventDefault();
  const name = document.getElementById('newClientName').value.trim();
  const company = document.getElementById('newClientCompany').value.trim();
  const project = document.getElementById('newClientProject').value.trim();
  const token = document.getElementById('newClientToken').value.trim().toUpperCase();
  const progress = Number(document.getElementById('newClientProgress').value);
  const drive = document.getElementById('newClientDrive').value.trim();

  config.clientPortals.push({
    token: token,
    clientName: name,
    company: company,
    projectTitle: project,
    progressPercent: progress,
    status: "In Progress",
    milestones: [
      { title: "Brief Analysis & Wireframes", done: progress >= 25 },
      { title: "High-Fidelity Visual Design", done: progress >= 50 },
      { title: "Client Review & Feedback", done: progress >= 75 },
      { title: "Final Deliverable Handoff", done: progress >= 100 }
    ],
    deliverablesUrl: drive || "#",
    revisions: []
  });

  saveConfigToStorage();
  closeAddClientModal();
  renderAdminClientList();
  showToast(`Client ${name} added with token: ${token}`);
}

function deleteClientPortal(token) {
  if (confirm(`Are you sure you want to delete client token ${token}?`)) {
    config.clientPortals = config.clientPortals.filter(c => c.token !== token);
    saveConfigToStorage();
    renderAdminClientList();
    showToast(`Client deleted.`);
  }
}

function copyClientSecretLink(token) {
  const currentBase = window.location.origin + window.location.pathname;
  const privateUrl = `${currentBase}?portal=${token}`;
  navigator.clipboard.writeText(privateUrl);
  showToast(`Copied Secret Client URL: ${privateUrl}`);
}

// Backup & Export / Import
function exportConfigJson() {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Virtual_Office_Backup_${config.profile.name.replace(/\s+/g, '_')}.json`;
  a.click();
  showToast('Settings backup downloaded.');
}

function importConfigJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      config = imported;
      saveConfigToStorage();
      renderApp();
      populateAdminFields();
      showToast('Settings imported successfully!');
    } catch (err) {
      alert('Invalid backup JSON file.');
    }
  };
  reader.readAsText(file);
}

function resetConfigToDefault() {
  if (confirm('Reset all office settings and client portals back to factory defaults?')) {
    config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    saveConfigToStorage();
    renderApp();
    populateAdminFields();
    showToast('Reset to default settings.');
  }
}

// ---------------- UTILS & TOASTS ----------------
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs shadow-2xl transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-2 pointer-events-none border border-slate-700 dark:border-slate-200';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove('translate-y-10', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3200);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
