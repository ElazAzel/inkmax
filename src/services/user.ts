/**
 * User service - handles user profile and authentication-related operations
 */
import { supabase } from '@/integrations/supabase/client';

// ============= Types =============
export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_premium: boolean | null;
  trial_ends_at: string | null;
}

export interface UpdateUsernameResult {
  success: boolean;
  error?: string;
}

// ============= Validation =============

const USERNAME_REGEX = /^[a-z0-9_-]+$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return { valid: false, error: `Username must be at least ${USERNAME_MIN_LENGTH} characters` };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return { valid: false, error: `Username must be less than ${USERNAME_MAX_LENGTH} characters` };
  }

  if (!USERNAME_REGEX.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain lowercase letters, numbers, hyphens, and underscores',
    };
  }

  return { valid: true };
}

// ============= API Functions =============

/**
 * Load user profile by ID
 */
export async function loadUserProfile(userId: string): Promise<{
  data: UserProfile | null;
  error: any;
}> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error loading profile:', error);
    return { data: null, error };
  }
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(
  username: string,
  currentUserId: string
): Promise<boolean> {
  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .neq('id', currentUserId)
    .maybeSingle();

  return !existingUser;
}

/**
 * Update user's username and sync with page slug
 */
export async function updateUsername(
  userId: string,
  username: string
): Promise<UpdateUsernameResult> {
  const validation = validateUsername(username);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const normalizedUsername = username.toLowerCase();

  // Check availability
  const isAvailable = await checkUsernameAvailability(normalizedUsername, userId);
  if (!isAvailable) {
    return { success: false, error: 'This username is already taken' };
  }

  try {
    // Update username in profile
    const { error: profileError } = await supabase.from('user_profiles').upsert({
      id: userId,
      username: normalizedUsername,
    });

    if (profileError) {
      console.error('Error updating username:', profileError);
      return { success: false, error: 'Failed to update username' };
    }

    // Sync page slug with new username
    await supabase.from('pages').update({ slug: normalizedUsername }).eq('user_id', userId);

    return { success: true };
  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, error: 'Failed to update username' };
  }
}

/**
 * Check user's premium status
 */
export async function checkPremiumStatus(userId: string): Promise<{
  isPremium: boolean;
  trialEndsAt: string | null;
  inTrial: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('is_premium, trial_ends_at')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return { isPremium: false, trialEndsAt: null, inTrial: false };
    }

    const now = new Date();
    const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
    const inTrial = trialEndsAt ? trialEndsAt > now : false;
    const isPremium = data.is_premium || inTrial;

    return { isPremium, trialEndsAt: data.trial_ends_at, inTrial };
  } catch (error) {
    console.error('Error checking premium status:', error);
    return { isPremium: false, trialEndsAt: null, inTrial: false };
  }
}
