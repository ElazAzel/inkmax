# lnkmx Platform Documentation

## Platform overview
lnkmx is a SaaS platform for building AI-assisted mini-sites and link-in-bio pages. The product is optimized for fast publishing, lead capture, and simple analytics.

## Company information
- Legal entity: ИП BEEGIN
- BIN: 971207300019
- Address: г. Алматы, ул. Шолохова, д. 20/7
- Email: admin@lnkmx.my
- Phone: +7 705 109 76 64

## Architecture
### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS with shadcn/ui
- i18next for RU/EN/KK
- PWA capabilities

### Backend
- Supabase (Postgres, Auth, Storage)
- Edge Functions for AI and notifications
- Row Level Security for data isolation

### AI integration
- AI draft generation for initial page structure and copy
- Translation for RU/EN/KK content

## Data model (high level)
### Core entities
- `pages`: public page metadata, SEO settings, theme.
- `blocks`: structured blocks for each page.
- `user_profiles`: plan, limits, and profile data.
- `subscriptions`: plan status and billing metadata.

### Leads and CRM
- `leads`: lead records collected from forms.
- `lead_interactions`: status history and notes.

### Analytics
- `analytics`: page views, CTA clicks, block clicks, and marketing events.

## i18n approach
- UI strings live in `src/i18n/locales/{ru,en,kk}.json`.
- Every marketing change requires RU/EN/KK updates.
- Use short, concrete copy and avoid long dash characters.

## SEO approach
- Marketing pages use localized titles, descriptions, and canonical URLs.
- JSON-LD schema is injected for WebPage, Organization, and FAQ.
- Sitemap and robots are maintained in `public/`.

## Adding new blocks safely
1. Add the block type to domain types and block registry.
2. Implement renderer and editor UI.
3. Add localization keys for labels and helper text.
4. Update free vs Pro gating rules if needed.
5. Add analytics tracking for clicks or form submits.

## Public routes
- `/` landing
- `/gallery` gallery
- `/pricing` pricing
- `/alternatives` comparisons
- `/terms` terms
- `/privacy` privacy
- `/payment-terms` payment terms

