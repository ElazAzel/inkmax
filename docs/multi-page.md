# Multi-Page Architecture

## Overview

Users can create multiple pages, with limits based on their plan:
- **Free**: 1 page
- **Pro**: 6 pages (1 primary paid + 5 free)

## Database Schema

New columns on `pages` table:
- `is_paid` (boolean) - Whether page has paid features
- `is_primary_paid` (boolean) - The one page included in Pro subscription
- `page_type` (text) - 'free' | 'paid_addon' | 'primary_paid'

## Plan Limits

| Plan | Max Pages | Primary Paid | Free Pages | Add-on Upgrades |
|------|-----------|--------------|------------|-----------------|
| Free | 1         | 0            | 1          | No              |
| Pro  | 6         | 1            | 5          | Yes (70% price) |

## API Functions

### `check_page_limits(user_id)` → jsonb
Returns current page counts and whether user can create more.

### `create_user_page(user_id, title, slug)` → jsonb
Creates a new page with limit enforcement.

### `set_primary_paid_page(user_id, page_id)` → jsonb
Sets which page is the primary paid page (Pro only).

## Frontend Components

### `useMultiPage` Hook
Manages page list, active page, limits, and CRUD operations.

### `PageSwitcher` Component
- Desktop: Dropdown menu in sidebar/header
- Mobile: Bottom sheet with search

### `CreatePageDialog` Component
Modal for creating new pages with limit enforcement.

## Page Context

- Active page stored in localStorage (`linkmax_active_page_id`)
- URL-based routing: `/dashboard?tab=pages`
- Settings are split: Page Settings vs Account Settings

## Slug Rules

- 3-30 characters
- Lowercase letters, numbers, hyphens only
- Must be unique globally
- Forms subdomain: `{slug}.lnkmx.my`
