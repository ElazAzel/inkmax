/**
 * Database module - re-exports from services for backward compatibility
 * @deprecated Use services/pages.ts directly
 */
export {
  savePage,
  loadPageBySlug,
  loadUserPage,
  publishPage,
  trackEvent,
  type DbPage,
  type DbBlock,
} from '@/services/pages';
