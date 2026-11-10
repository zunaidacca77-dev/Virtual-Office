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
    bio: "I craft high-converting digital interfaces, web applications, and scalable design systems for global brands. Step into my virtual office to collaborate live or kick off your next project below.",
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
    whatsappPrefill: "Hello! I am currently visiting your Virtual Office and would like to discuss a new project with you."
  },
  aiDesk: {
    assistantName: "Alex (AI Receptionist)",
    welcomeMessage: "Welcome to my Virtual Office! I am Alex, your 24/7 AI Receptionist. How can I assist you today? Feel free to ask about our service packages, pricing, or book an instant meeting.",
    systemPrompt: `You are the official AI Receptionist for Zunaid Hasan's Virtual Office. Greet clients politely.
1. Our packages: Starter ($50/৳5,000), Standard ($150/৳15,000), and Custom Enterprise.
2. If the client asks to talk live, invite them to click 'Knock & Enter Live Room' on the left.
3. If Zunaid is offline, collect their Name, WhatsApp/Email, and Project Brief.
4. Reply concisely in English or Bengali depending on the user's language.`,
    embedCode: "" // Optional Chatbase / Tawk iframe or script
  },
  tally: {
    embedUrl: "https://tally.so/embed/mK9d5l?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
    useEmbeddedTally: false
  },
  packages: [
    {
      id: "starter",
      name: "Starter / Basic",
      badge: "Fast Delivery",
      priceUSD: 50,
      priceBDT: 5000,
      deliveryTime: "2-3 Days",
      revisions: "2 Iterations",
      popular: false,
      features: [
        "1 Landing Page or Hero Concept",
        "Clean Responsive Layout (Mobile + Web)",
        "Figma / Source File Handoff",
        "Standard Turnaround & Support",
        "Commercial Usage Rights"
      ]
    },
    {
      id: "standard",
      name: "Standard / Growth Pro",
      badge: "Most Popular",
      priceUSD: 150,
      priceBDT: 15000,
      deliveryTime: "5-7 Days",
      revisions: "Unlimited Revisions",
      popular: true,
      features: [
        "Up to 5 Pages Complete Website Design",
        "Interactive Prototype & Design System",
        "Priority Meeting & Video Support",
        "Speed & Conversion Optimization",
        "Source Files + Developer Handoff Specs",
        "Dedicated VIP Client Portal Tracking"
      ]
    },
    {
      id: "enterprise",
      name: "Custom / Enterprise",
      badge: "Tailored Solution",
      priceUSD: 450,
      priceBDT: 45000,
      deliveryTime: "10-14 Days",
      revisions: "VIP Continuous",
      popular: false,
      features: [
        "Full-Scale Custom Application Design",
        "Complete Brand Identity & UI Kit",
        "Live Dedicated Slack/Whereby Channel",
        "Daily Milestone Check-ins",
        "30-Day Post Launch Support & Maintenance",
        "Full Intellectual Property Transfer"
      ]
    }
  ],
  portfolio: [
    {
      id: 1,
      title: "FinFlow - AI Wealth & Analytics SaaS",
      category: "uiux",
      categoryLabel: "UI/UX & SaaS",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      description: "Complete design system and dashboard architecture for an AI-powered financial management platform with live predictive metrics.",
      results: "+140% User Engagement, 4.9 App Rating",
      tools: ["Figma", "Tailwind CSS", "React"]
    },
    {
      id: 2,
      title: "Apex Logistics & Global Fleet Hub",
      category: "webdev",
      categoryLabel: "Web Development",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      description: "Real-time dispatch system and tracking portal built for international freight management handling 50k+ daily deliveries.",
      results: "35% reduction in delivery delay disputes",
      tools: ["Next.js", "TypeScript", "Tailwind"]
    },
    {
      id: 3,
      title: "LuxeVibe - Minimalist eCommerce Store",
      category: "ecommerce",
      categoryLabel: "eCommerce",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      description: "High-converting boutique apparel platform with 1-click checkout and customized 3D product previews.",
      results: "2.4x higher conversion rate in 60 days",
      tools: ["Shopify", "Liquid", "Figma"]
    },
    {
      id: 4,
      title: "HealthPulse - Patient Telemed Portal",
      category: "uiux",
      categoryLabel: "UI/UX & Mobile",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      description: "Secure, HIPAA-compliant patient consultation portal and mobile app with instant video prescriptions.",
      results: "Over 80,000 active remote consults",
      tools: ["Figma", "React Native", "Tailwind"]
    },
    {
      id: 5,
      title: "Krypton - Web3 DAO Governance Suite",
      category: "webdev",
      categoryLabel: "Web Development",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
      description: "Decentralized treasury proposal interface with voting visualizations and real-time smart contract sync.",
      results: "$12M+ Assets actively governed",
      tools: ["Web3.js", "Next.js", "Tailwind"]
    },
    {
      id: 6,
      title: "Zenith - Corporate Brand & Identity",
      category: "branding",
      categoryLabel: "Brand Identity",
      image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
      description: "End-to-end visual rebranding, corporate guidelines, typography, and stationery kit for a tech consultancy.",
      results: "Featured on Behance Best of Branding",
      tools: ["Illustrator", "Photoshop", "Brand Guide"]
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
      projectTitle: "FinFlow Mobile UI & Web Dashboard",
      startDate: "2026-10-15",
      targetDelivery: "2026-11-20",
      status: "In Progress (Under Review)",
      progressPercent: 75,
      milestones: [
        { title: "Brief Analysis & Wireframes", done: true },
        { title: "High-Fidelity Visual Design", done: true },
        { title: "Client Review & Feedback Iteration", done: true },
        { title: "Final Deliverable Handoff & Assets", done: false }
      ],
      deliverablesUrl: "https://drive.google.com/drive/folders/demo-client-101-david",
      revisions: [
        {
          date: "Nov 02, 2026",
          note: "Updated dark mode palette on the analytics dashboard as requested.",
          author: "Zunaid Hasan (Studio Owner)"
        },
        {
          date: "Nov 05, 2026",
          note: "Please adjust typography on the mobile navigation bar.",
          author: "David Miller (Client)"
        }
      ]
    },
    {
      token: "PRJ-202-EMMA",
      clientName: "Emma Watson",
      company: "Luxe Bloom UK",
      projectTitle: "LuxeVibe Brand Kit & Shopify Storefront",
      startDate: "2026-10-28",
      targetDelivery: "2026-11-14",
      status: "Final Quality Check",
      progressPercent: 90,
      milestones: [
        { title: "Brand Discovery & Moodboards", done: true },
        { title: "Shopify Custom Theme Architecture", done: true },
        { title: "Speed & Mobile Responsive QA", done: true },
        { title: "Live Storefront Launch & Transfer", done: false }
      ],
      deliverablesUrl: "https://drive.google.com/drive/folders/demo-client-202-emma",
      revisions: [
        {
          date: "Nov 06, 2026",
          note: "Initial theme demo delivered for review.",
          author: "Zunaid Hasan (Studio Owner)"
        }
      ]
    }
  ]
};
