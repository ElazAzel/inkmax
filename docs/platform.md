# lnkmx Platform Documentation

## Platform Overview

lnkmx is a SaaS platform for creating AI-powered personal mini-websites (link-in-bio pages). Target markets: CIS region (primary), global creator economy (secondary).

**Website:** https://lnkmx.my  
**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Supabase (Lovable Cloud)

## Company Information

**Legal Entity:** ИП BEEGIN  
**BIN (IIN):** 971207300019  
**Address:** г. Алматы, ул. Шолохова, д. 20/7  
**Bank:** АО "Kaspi Bank"  
**Email:** admin@lnkmx.my  
**Phone:** +7 705 109 76 64

## Pricing Structure

### Free Tier

- 5 blocks per page limit
- 1 AI generation per month
- Basic blocks only
- lnkmx watermark
- Community gallery access

### Pro Tier

- Unlimited blocks
- 5 AI generations per month
- All premium blocks
- Mini-CRM with Telegram notifications
- Advanced analytics
- Custom themes & backgrounds
- Priority support

### Pro Pricing (KZT)

| Period    | Monthly Rate | Total    |
| --------- | ------------ | -------- |
| 3 months  | 4,350 ₸      | 13,050 ₸ |
| 6 months  | 3,500 ₸      | 21,000 ₸ |
| 12 months | 2,610 ₸      | 31,320 ₸ |

### Payment Methods

- RoboKassa (primary gateway)
- Bank cards (Visa, Mastercard, etc.)
- Kaspi transfers
- Apple Pay / Google Pay (via RoboKassa)

## Architecture

### Frontend

- React 18 with TypeScript
- Vite build system
- Tailwind CSS with custom design tokens
- Shadcn/ui component library
- i18next for localization
- PWA with offline support

### Backend ( Supabase)

- PostgreSQL database
- Row Level Security (RLS)
- Edge Functions for serverless logic
- Realtime subscriptions
- Storage for media files

### AI Integration

- Gemini 2.5 Flash (page generation, content)
- AI Chatbot for visitor Q&A
- Auto-translation system

## Database Schema

### Core Tables

- `pages` - User pages with theme/SEO settings
- `blocks` - Page blocks with content JSON
- `user_profiles` - User data, premium status, streaks
- `user_roles` - Admin/moderator roles

### CRM Tables

- `leads` - Lead records from forms
- `lead_interactions` - Communication history
- `crm_automations` - Automation rules
- `bookings` - Appointment bookings
- `booking_slots` - Available time slots

### Social Tables

- `collaborations` - Collab requests
- `teams` - Team pages
- `team_members` - Team membership
- `shoutouts` - Creator shoutouts
- `friendships` - Friend connections

### Gamification Tables

- `user_achievements` - Unlocked achievements
- `daily_quests_completed` - Quest completions
- `weekly_challenges` - Active challenges
- `challenge_progress` - User challenge progress
- `user_tokens` - Token balances

### Referral Tables

- `referral_codes` - User referral codes
- `referrals` - Referral tracking

### Template Tables

- `user_templates` - Saved templates
- `template_likes` - Template likes
- `template_purchases` - Template sales

### Analytics Tables

- `analytics` - Event tracking
- `page_likes` - Gallery likes
- `page_boosts` - Promoted pages

## Edge Functions

### AI Functions

- `ai-content-generator` - Page/content generation
- `chatbot-stream` - AI chatbot streaming
- `translate-content` - Auto-translation

### Notification Functions

- `send-booking-notification` - Booking alerts
- `send-booking-reminder` - Booking reminders
- `send-collab-notification` - Collab requests
- `send-friend-notification` - Friend activity
- `send-lead-notification` - New lead alerts
- `send-social-notification` - Social updates
- `send-team-notification` - Team changes
- `send-trial-ending-notification` - Trial expiry
- `send-weekly-digest` - Weekly summaries
- `send-weekly-motivation` - Engagement emails

### CRM Functions

- `create-lead` - Lead creation
- `process-crm-automations` - Automation runner

### Telegram Functions

- `telegram-bot-webhook` - Bot webhook handler
- `telegram-password-reset` - Password recovery
- `validate-telegram` - Account verification

### Utility Functions

- `seed-demo-accounts` - Demo account generator

## URL Structure

### Public Routes

- `/` - Landing page
- `/:username` - Public user page
- `/gallery` - Community gallery
- `/pricing` - Pricing page
- `/alternatives` - Comparison page
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/payment-terms` - Payment Terms

### Protected Routes

- `/dashboard` - User dashboard/editor
- `/admin` - Admin panel

### Special Routes

- `/auth` - Authentication
- `/install` - PWA installation
- `/team/:slug` - Team pages
- `/collab/:collabSlug` - Collaboration pages
- `/join/:inviteCode` - Team invite links

## Security

### Authentication

- Email/password signup
- Auto-confirm enabled
- Telegram verification (optional)
- Password reset via email/Telegram

### Authorization

- Row Level Security on all tables
- Role-based admin access
- JWT token validation

### Data Protection

- HTTPS everywhere
- Password hashing (bcrypt)
- Input sanitization (DOMPurify)
- Rate limiting on sensitive endpoints

## Legal Documents

- **Terms of Service:** https://lnkmx.my/terms
- **Privacy Policy:** https://lnkmx.my/privacy
- **Payment Terms:** https://lnkmx.my/payment-terms

Governed by laws of Republic of Kazakhstan.

## Target Audiences

1. **Instagram/TikTok Creators** - Single bio link solution
2. **Freelancers & Experts** - Portfolio and pricing showcase
3. **Small Businesses** - Lightweight product catalog
4. **Musicians & Artists** - Streaming/merch/event aggregation

## Competitive Advantages

- AI-first page generation (1-minute setup)
- Mobile-primary workspace design
- Integrated Mini-CRM with Telegram
- Gamification and social features
- Localized for CIS market (RU/KK/EN)
- Affordable pricing in local currency
