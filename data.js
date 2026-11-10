// Default Configuration & Mock Data for Master Virtual Office
const DEFAULT_CONFIG = {
  security: {
    adminPin: "7788" // Master PIN for Owner/Admin access
  },
  profile: {
    name: "Zunaid Hasan",
    title: "Cloud Accounting Specialist",
    avatar: "profile.png?v=4",
    cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&h=600&q=80",
    bio: "Certified Cloud Accounting & Bookkeeping Specialist helping US, UK, Canadian & Global businesses streamline financial operations, QuickBooks Online & Xero reconciliations, catch-up cleanups, payroll, and tax-ready financial reporting.",
    status: "online", // 'online' or 'deepwork'
    statusOnlineText: "🟢 Office Status: Online (Available for Instant Meeting)",
    statusDeepworkText: "🔴 In a Deep Work Session (Leave a message with my AI Receptionist)",
    responseTime: "⚡ Typically replies within 15 mins",
    rating: "5.0 ★ (48+ Projects Delivered)",
    location: "Dhaka, Bangladesh (UTC+6)"
  },
  meeting: {
    wherebyUrl: "https://whereby.com/demo-virtual-office",
    calUrl: "https://cal.com/demo-trainee/30min",
    whatsappNumber: "8801700000000",
    whatsappPrefill: "Hello! I am currently visiting your Virtual Office and would like to discuss my accounting & bookkeeping requirements with you."
  },
  aiDesk: {
    assistantName: "Alex (AI Receptionist)",
    welcomeMessage: "Welcome to Zunaid Hasan's Virtual Office! I am Alex, your 24/7 AI Accounting Receptionist. How can I assist you with your QuickBooks, Xero, monthly bookkeeping, or tax prep needs today?",
    systemPrompt: `You are the official AI Receptionist for Zunaid Hasan's Virtual Office. Zunaid Hasan is a certified Cloud Accounting & Bookkeeping Specialist (QuickBooks Online, Xero, Zoho Books, Wave). Greet clients politely.
1. Our Core Services:
   - Monthly Bookkeeping & Bank Reconciliation (Starter Package: $50 / ৳5,000)
   - Multi-Currency Accounting, AP/AR & eCommerce Sync (Growth Pro: $150 / ৳15,000)
   - Multi-Year Historical Cleanup, Catch-Up & Tax-Ready Financials (Custom / Enterprise: $450 / ৳45,000)
2. If the client asks to speak live, invite them to click 'Knock & Enter Live Room' on the left.
3. If Zunaid is in a Deep Work session, collect their Name, Business Name, Accounting Software, and WhatsApp/Email.
4. Reply concisely in English or Bengali depending on the user's language.`,
    embedCode: "" // Optional Chatbase / Tawk iframe or script
  },
  tally: {
    embedUrl: "https://tally.so/embed/mK9d5l?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
    useEmbeddedTally: false
  },
  ads: {
    metaPixelId: "",
    googleTagId: "",
    metaBannerText: "Welcome from Meta! Book a Free 15-Minute Cloud Accounting Strategy Call with Zunaid Hasan.",
    googleBannerText: "Welcome from Google Search! Claim your Free Bookkeeping & Accounting Consultation with Zunaid Hasan."
  },
  packages: [
    {
      id: "starter",
      name: "Monthly Bookkeeping Starter",
      badge: "Up to 50 Trx",
      priceUSD: 50,
      priceBDT: 5000,
      deliveryTime: "3-5 Days",
      revisions: "2 Iterations",
      popular: false,
      features: [
        "Monthly Bank & Credit Card Reconciliation (up to 50 Trx)",
        "Chart of Accounts Setup & Category Review",
        "Monthly Profit & Loss and Balance Sheet Statements",
        "QuickBooks Online or Xero Cloud Integration",
        "Email & WhatsApp Consultation Support"
      ]
    },
    {
      id: "standard",
      name: "Growth Business Accounting",
      badge: "Most Popular",
      priceUSD: 150,
      priceBDT: 15000,
      deliveryTime: "5-7 Days",
      revisions: "Unlimited Revisions",
      popular: true,
      features: [
        "Complete Bookkeeping & Categorization (Up to 250 Trx)",
        "Multi-Currency Bank, PayPal & Stripe Reconciliation",
        "Accounts Payable (AP) & Accounts Receivable (AR)",
        "Detailed Financial Analysis & Cash Flow Reports",
        "Inventory & eCommerce Sync (Shopify, Amazon, Stripe)",
        "Dedicated VIP Client Portal & Priority Call Support"
      ]
    },
    {
      id: "enterprise",
      name: "CFO Advisory & Catch-Up Cleanup",
      badge: "Tailored Solution",
      priceUSD: 450,
      priceBDT: 45000,
      deliveryTime: "10-14 Days",
      revisions: "VIP Continuous",
      popular: false,
      features: [
        "Multi-Year Historical Cleanup & Messy Books Catch-Up",
        "Complete Tax-Ready Financial Statements Prep",
        "Payroll Processing & Contractor 1099 Compliance",
        "Fractional CFO Advisory & Cash Flow Forecasting",
        "Custom ERP & Cloud Software Migration (QBO/Xero/Zoho)",
        "Direct Live Whereby/Zoom Video Consultation & Support"
      ]
    }
  ],
  portfolio: [
    {
      id: 1,
      title: "Multi-Year QuickBooks Online Cleanup & Catch-Up",
      category: "cleanup",
      categoryLabel: "QuickBooks Cleanup",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      description: "Rescued and reconciled 2 years of backlog transactions for a US consulting firm, resolving $180k+ in unallocated balances and delivering audit-ready books.",
      results: "100% Tax-Ready in 14 Days, Saved $12k Penalties",
      tools: ["QuickBooks Online", "Excel", "Bank Feeds", "Dext"]
    },
    {
      id: 2,
      title: "Xero Multi-Currency Migration & Setup for UK Agency",
      category: "quickbooks",
      categoryLabel: "Xero Cloud Setup",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "Migrated legacy desktop accounting data to Xero Cloud with multi-currency (USD, GBP, EUR) automated feeds, customized Chart of Accounts, and invoice automation.",
      results: "Saved 15+ Hours/Week on Manual Data Entry",
      tools: ["Xero", "Hubdoc", "Stripe", "Wise"]
    },
    {
      id: 3,
      title: "eCommerce Bookkeeping Sync for 7-Figure Shopify Store",
      category: "ecommerce",
      categoryLabel: "eCommerce Accounting",
      image: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
      description: "Automated sales revenue, COGS (Cost of Goods Sold), merchant fees, and state sales tax reconciliation across Shopify, Amazon FBA, and Stripe into QuickBooks Online.",
      results: "Zero Inventory Variance & Accurate Gross Margins",
      tools: ["QuickBooks Online", "A2X", "Shopify", "TaxJar"]
    },
    {
      id: 4,
      title: "Year-End Financial Reporting & CPA Tax Audit Prep",
      category: "reporting",
      categoryLabel: "Financial Reporting & Tax",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
      description: "Prepared comprehensive Profit & Loss, Balance Sheet, and Cash Flow statements with detailed schedules for CPA review and annual corporate tax filing.",
      results: "Delivered 5 Days Ahead of CPA Tax Deadline",
      tools: ["Excel Advanced", "QuickBooks Online", "GAAP Standards"]
    },
    {
      id: 5,
      title: "Zoho Books Complete Implementation & Payroll Sync",
      category: "quickbooks",
      categoryLabel: "Zoho Books & Payroll",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      description: "End-to-end setup of Zoho Books for a tech enterprise including automated bank rules, employee payroll runs, expense management, and departmental reporting.",
      results: "100% On-Time Payroll & Error-Free Accounts",
      tools: ["Zoho Books", "Zoho Payroll", "Gusto", "Stripe"]
    },
    {
      id: 6,
      title: "Cash Flow Forecasting & Budgeting Model for Startup",
      category: "reporting",
      categoryLabel: "CFO Advisory",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
      description: "Built a dynamic 12-month rolling cash flow forecasting and burn-rate model in Excel, empowering founders to extend runway and secure Series-A funding.",
      results: "Extended Runway by 4 Months, $1.5M Funding Secured",
      tools: ["Financial Modeling", "Excel", "QBO", "Fathom"]
    }
  ],
  payments: {
    payoneerEmail: "payments@zunaidhasan.com",
    payoneerLink: "https://login.payoneer.com/",
    wiseLink: "https://wise.com/pay/me/traineedemo",
    stripeCardLink: "https://buy.stripe.com/demo-payment-link",
    bkashNumber: "01711-223344",
    bkashType: "Personal (Send Money)",
    nagadNumber: "01911-556677",
    nagadType: "Personal (Send Money)",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bkash://sendmoney?account=01711223344"
  },
  clientPortals: [
    {
      token: "PRJ-101-DAVID",
      clientName: "David Miller",
      company: "Apex Ventures USA",
      projectTitle: "Multi-Year QuickBooks Cleanup & Catch-Up",
      startDate: "2026-10-15",
      targetDelivery: "2026-11-20",
      status: "In Progress (Under Review)",
      progressPercent: 75,
      milestones: [
        { title: "Chart of Accounts & Bank Feed Audit", done: true },
        { title: "Historical Reconciliation (2024-2025)", done: true },
        { title: "Unallocated Balance & AP/AR Resolution", done: true },
        { title: "Final Tax-Ready Financial Statements Delivery", done: false }
      ],
      deliverablesUrl: "https://drive.google.com/drive/folders/demo-client-101-david",
      revisions: [
        {
          date: "Nov 02, 2026",
          note: "Reconciled all 4 business checking accounts and Stripe merchant clearing account.",
          author: "Zunaid Hasan (Studio Owner)"
        },
        {
          date: "Nov 05, 2026",
          note: "Please review uncategorized expense queries in the shared spreadsheet.",
          author: "David Miller (Client)"
        }
      ]
    },
    {
      token: "PRJ-202-EMMA",
      clientName: "Emma Watson",
      company: "Luxe Bloom UK",
      projectTitle: "Xero Multi-Currency & Shopify Integration",
      startDate: "2026-10-28",
      targetDelivery: "2026-11-14",
      status: "Final Quality Check",
      progressPercent: 90,
      milestones: [
        { title: "Xero Cloud Migration & Multi-Currency Setup", done: true },
        { title: "Shopify & Stripe Automated Sync (A2X)", done: true },
        { title: "Monthly P&L, Balance Sheet & VAT Audit", done: true },
        { title: "Year-End Financial Pack Handoff", done: false }
      ],
      deliverablesUrl: "https://drive.google.com/drive/folders/demo-client-202-emma",
      revisions: [
        {
          date: "Nov 06, 2026",
          note: "A2X payout reconciliation configured for Shopify UK and EU sales.",
          author: "Zunaid Hasan (Studio Owner)"
        }
      ]
    }
  ]
};
