# 🌐 Master Virtual Office & Agency Portal (v2.0)
> **The Modern, High-Converting Digital Workplace for Freelancers, Trainees & Agencies**

A complete, production-ready, fully responsive virtual office web application. Built with modern SaaS aesthetics, glassmorphism cards, interactive micro-animations, and a zero-code **Trainee Customization Drawer**.

---

## 🚀 Quick Start (Zero Setup Needed)
1. Double-click `index.html` to open it in Google Chrome, Microsoft Edge, Safari, or any browser.
2. Click **⚙️ Customize Office** (top right) to change your name, avatar, bio, Whereby link, WhatsApp number, and payment information.
3. All changes are saved automatically in your browser's `localStorage` and will persist across refreshes.

### 🌐 Free Hosting in 30 Seconds:
- **Netlify Drop:** Drag and drop this folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel:** Import this folder with zero configuration.
- **GitHub Pages:** Push to a repo and enable GitHub Pages on the `main` branch.

---

## 🏛️ Core Architecture & 6 Key Sections

### 1. Reception & Welcome Zone (Hero)
- **Dynamic Profile Banner & Avatar:** Displays trainee name, skill title, trust badges, and response time.
- **Interactive Live Status Toggle:** Switch instantly between:
  - 🟢 `Office Status: Online (Available for Instant Meeting)`
  - 🔴 `In a Deep Work Session (Leave a message with my AI Receptionist)`
- Click the status badge anywhere on the navbar or hero to toggle states.

### 2. Instant Meeting & AI Front-Desk ("Live Lounge") [UPDATED]
- **Left Column (Direct Meeting Room):**
  - `[ 🚪 Knock & Enter Live Room ]`: Opens an instant Whereby video cabin modal without requiring software installations.
  - `[ 📅 Schedule a Meeting ]`: Embeds Cal.com / Calendly calendar booking.
- **Right Column (24/7 AI Desk + Direct Connect):**
  - **Interactive AI Receptionist:** Responds intelligently to inquiries about packages, pricing ($50 / $150 / custom), meetings, and briefs.
  - **Direct WhatsApp Fallback:** 1-click button with pre-filled message (`https://wa.me/...`) that never runs out of credits.
  - **Quick Inquiry (Tally Form):** Conversational lead capture popup.

### 3. Service Catalog & Portfolio Showcase ("The Showroom")
- **Dynamic Currency Switcher:** Toggle between **USD ($)** and **BDT (৳)** with live price calculation.
- **3-Tiered Pricing Grid:**
  - **Starter / Basic:** $50 / ৳5,000 (Fast 2-3 Day Delivery).
  - **Standard / Growth Pro (Featured):** $150 / ৳15,000 (Unlimited Revisions).
  - **Custom / Enterprise:** Tailored solution.
  - Clicking "Select Package" auto-scrolls and preselects the package in Section 4!
- **Portfolio Gallery:** Filterable 6-card showcase with tags, measurable client results, and full Case Study preview modals.

### 4. Project Onboarding Desk ("Start a Project")
- **Dual Mode Switcher:** Switch between the built-in fast form and the embedded Tally.so form.
- **Intake Fields:** Client Name, Contact (Email/WhatsApp), Package selector, Timeline urgency, Project Brief, and File/Drive link attachment.
- **Celebration Confetti:** Submitting triggers a confetti explosion 🎉 and routes directly to the Billing Counter with a live invoice summary.

### 5. Official Cash Counter & Billing Desk
- **International Gateways:** Payoneer / Wise payment request links with 1-click email copy.
- **Local Bangladeshi Mobile Banking:**
  - Tabbed switcher for **bKash** and **Nagad**.
  - Dynamic QR Code render and 1-click copy number.
  - Interactive **Transaction ID (TrxID) Verification** with downloadable/printable payment voucher receipt.

### 6. Private Client VIP Portal (Strict Privacy Architecture) [UPDATED]
- **Privacy Rule:** No client names or project files are publicly exposed to random visitors.
- **Secure Access Gateway:** Clients must enter their unique secret token (e.g. `PRJ-101-DAVID` or `PRJ-202-EMMA`).
- **Direct Link Support:** Clients accessing via URL parameter (e.g. `index.html?portal=PRJ-101-DAVID`) automatically unlock their private workspace!
- **Inside the VIP Portal:**
  1. **Visual Milestone Tracker:** Real-time completion progress bar (e.g. 75%) with 4 milestone stages.
  2. **Deliverables Box:** Direct `[ ⬇️ Download Final Files (Google Drive) ]` button.
  3. **Revision & Feedback Box:** Client submits revision notes, which are stored in the private revision history log.

---

## ⚙️ Trainee Admin Customization Drawer
Click the **⚙️ Customize Office** button on the navbar:
1. **Profile:** Edit name, skill title, avatar URL, cover photo, bio, and trust badges.
2. **Meetings & Links:** Update your Whereby room, Cal.com link, WhatsApp number, and pre-fill message.
3. **AI & Forms:** Customize your AI assistant name, greeting, system prompt, and Tally form URL.
4. **Packages:** Change prices (USD & BDT) and delivery timelines.
5. **Payments:** Set up Payoneer, bKash, and Nagad account numbers.
6. **VIP Portals Manager:**
   - Add new client projects with custom tokens.
   - Set progress % and milestones.
   - 1-click copy secret private link (`?portal=TOKEN`) to send to individual clients via WhatsApp or Email.
7. **Backup & Reset:**
   - Export your entire office configuration as a `.json` file.
   - Import previous backups.
   - Reset to factory defaults.

---

## 📁 File Structure
```
Virtual Office Set Up/
├── index.html                                   # Complete UI layout, modals, navbar & sections
├── app.js                                       # State manager, AI chat, portal logic & admin drawer
├── data.js                                      # Default trainee config, services & portfolio mock data
├── README.md                                    # Full documentation & deployment guide
├── Master_Virtual_Office_Blueprint_v2_Updated.docx # Word document guide
└── build_word_document.py                       # Python script generator for docx
```
