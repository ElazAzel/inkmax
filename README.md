# LinkMAX - The Micro-Business OS

**LinkMAX** is a comprehensive operating system for micro-businesses, creators, and experts. It combines a high-performance bio page builder, CRM, analytics, and monetization tools into a single platform.

**Live:** [lnkmx.my](https://lnkmx.my)

## 🚀 Core Features

### 🎨 Visual Builder

- **28+ Block Types**: Bio, Links, Commerce, Events, Gamification, and more.
- **AI Copilot**: Instantly generate professional bio content and designs.
- **Mobile-First**: Optimized for social media traffic.

### 💼 CRM & Business Tools

- **Lead Capture**: Built-in forms and automations.
- **Booking System**: Schedule appointments directly from your bio.
- **Event Management**: Sell tickets and manage attendees.
- **Commerce**: Digital products and services integration.

### 📊 Analytics & Growth

- **Real-time Insights**: Traffic sources, clicks, and conversion tracking.
- **Gamification**: Daily quests and challenges to engage users.
- **SEO Optimized**: Public profiles are server-side rendered (SSR) for maximum visibility.

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript 5, Vite 5, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Edge Layer**: Cloudflare Workers (Bot Routing & Prerendering)
- **PWA**: Fully installable Progressive Web App
- **State**: React Query (Server state), Context (Local state)

For a detailed architectural breakdown, see [PLATFORM_SNAPSHOT.md](./docs/PLATFORM_SNAPSHOT.md).

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/inkmax.git
cd inkmax

# 2. Install dependencies
npm install

# 3. Setup Environment
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY

# 4. Start Development Server
npm run dev
```

### Build & Deploy

```bash
# Production Build
npm run build

# Preview Build
npm run preview
```

## 🧪 Testing & Quality

```bash
npm run lint        # Code style check
npm run typecheck   # TypeScript validation
npm run test        # Unit tests (Vitest)
npm run e2e         # End-to-End tests (Playwright)
```

## 🌍 Localization

LinkMAX is localized in **English (en)**, **Russian (ru)**, and **Kazakh (kk)**.

- Add new keys to `src/i18n/locales/*.json`
- Run `npm run i18n:check` to verify consistency.

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

Proprietary Software. Copyright © 2026 LinkMAX. All rights reserved.
