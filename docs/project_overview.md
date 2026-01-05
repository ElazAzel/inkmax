# LinkMAX Project Overview

## Vision

LinkMAX is an AI-powered link-in-bio platform that automatically generates personalized mini-websites for creators, experts, and small businesses in 2 minutes. We're replacing time-consuming manual page creation with intelligent, AI-driven design and content generation.

## Mission

Democratize professional web presence for creators and small businesses in the CIS region and beyond, making it as easy as describing your business to have a beautiful, functional landing page.

## Market Position

**Primary Market:** CIS region (replacing outdated Taplink, Hipolink)  
**Secondary Market:** Global creator economy  
**Competitive Edge:** AI-first approach + premium design + 2-minute setup

## Business Model

### Freemium SaaS
- Free tier with basic features + watermark
- Pro subscription ($6.99 USD / 2,610-4,350 KZT monthly)
- Template marketplace (future revenue stream)

### Key Metrics Targets
- User activation: AI page generation as "aha moment"
- Retention: Streak system, daily quests, achievements
- Virality: Referral codes, watermark, gallery sharing

## Core Value Propositions

### For Creators
- One link for all social profiles and content
- Beautiful, mobile-optimized pages
- Real-time analytics on link clicks

### For Freelancers
- Professional portfolio in minutes
- Service pricing display
- Lead capture with CRM

### For Small Business
- Product catalog without e-commerce complexity
- Booking system for appointments
- Telegram notifications for leads

## Technology Stack

### Frontend
```
React 18 + TypeScript + Vite
Tailwind CSS + Shadcn/ui
i18next (RU/EN/KK)
PWA + Service Worker
```

### Backend (Lovable Cloud)
```
Supabase (PostgreSQL + Auth + Storage)
Edge Functions (Deno)
Row Level Security
Realtime Subscriptions
```

### AI
```
Gemini 2.5 Flash (content generation)
Gemini 2.5 Pro (complex tasks)
```

### Payments
```
RoboKassa (primary gateway)
Multi-currency (KZT, RUB, USD, EUR)
```

## Product Pillars

### 1. AI-First Experience
- Page generation from text description
- Content suggestions and copywriting
- Auto-translation across languages
- Chatbot for visitor Q&A

### 2. Mobile-Primary Design
- Smartphone as primary workspace
- Touch-optimized editor
- PWA installation
- Responsive preview

### 3. Business Tools
- Mini-CRM with lead tracking
- Booking system
- Analytics dashboard
- Telegram notifications

### 4. Social & Viral
- Community gallery
- Collaborations between creators
- Referral program
- Gamification (streaks, quests, achievements)

## Feature Roadmap Status

### ✅ Shipped
- Drag-and-drop block editor
- 20+ block types
- AI page generation
- Theme customization
- Mini-CRM with leads
- Telegram notifications
- Booking system
- Analytics dashboard
- Template marketplace
- Referral system
- Streak & achievements
- Collaborations & teams
- Multi-language (RU/EN/KK)
- PWA support

### 🚧 In Progress
- RoboKassa payment integration
- Advanced analytics (funnels, heatmaps)
- Template selling marketplace

### 📋 Planned
- White-label solution
- API access for developers
- Additional payment gateways
- Email marketing integration
- A/B testing for blocks

## Growth Strategy

### Acquisition
1. TikTok/Reels viral content
2. Micro-influencer partnerships
3. Product Hunt launch
4. SMM agency partnerships
5. Watermark-driven virality

### Activation
1. Interactive onboarding
2. AI page as "aha moment"
3. Template gallery for quick start
4. Niche-specific suggestions

### Retention
1. Daily quests with rewards
2. Streak bonuses
3. Achievement system
4. Weekly challenges
5. Friend activity feed

### Referral
1. Trial days for referrals
2. Top Referrers leaderboard
3. Share dialogs after publish
4. Social sharing incentives

## Team & Legal

**Company:** ИП BEEGIN  
**BIN:** 971207300019  
**Location:** Almaty, Kazakhstan  
**Contact:** admin@lnkmx.my

**Legal Documents:**
- Terms of Service: /terms
- Privacy Policy: /privacy
- Payment Terms: /payment-terms

**Jurisdiction:** Republic of Kazakhstan

## Success Metrics

### User Metrics
- MAU (Monthly Active Users)
- Pages created per user
- Block usage distribution
- AI generation adoption

### Business Metrics
- MRR (Monthly Recurring Revenue)
- Conversion rate (free → pro)
- Churn rate
- LTV (Lifetime Value)

### Engagement Metrics
- Daily active streaks
- Quest completion rate
- Referral conversion
- Gallery engagement (likes, views)

## Development Principles

1. **Mobile-First** - Design for smartphones, adapt for desktop
2. **AI-Powered** - Leverage AI for user value at every step
3. **Fast Iteration** - Ship small, learn fast, iterate
4. **Localization** - Native experience for CIS users
5. **Security** - RLS policies, input validation, encryption

## Repository Structure

```
src/
├── components/       # UI components
│   ├── blocks/       # Block renderers
│   ├── block-editors/# Block edit forms
│   ├── ui/           # Shadcn components
│   └── ...
├── pages/            # Route pages
├── hooks/            # Custom React hooks
├── services/         # API/business logic
├── domain/           # Domain entities
├── types/            # TypeScript types
├── lib/              # Utilities
└── i18n/             # Translations

supabase/
├── functions/        # Edge functions
└── migrations/       # DB migrations

docs/
├── Features.md       # Feature documentation
├── platform.md       # Platform docs
├── project_overview.md # This file
└── demo-accounts.md  # Demo account info
```

## Contact

- **Email:** admin@lnkmx.my
- **Phone:** +7 705 109 76 64
- **Website:** https://lnkmx.my
