-- Fix 1: Remove public access to bookings table (contains PII)
DROP POLICY IF EXISTS "Anyone can view bookings for public pages" ON public.bookings;

-- Fix 2: Remove overly permissive user_profiles policy that exposes sensitive fields
-- Users should query public_user_profiles view instead for other users' data
DROP POLICY IF EXISTS "Users can view public profile data" ON public.user_profiles;

-- Fix 3: Update shoutouts policy to restrict visibility
DROP POLICY IF EXISTS "Anyone can view shoutouts" ON public.shoutouts;

CREATE POLICY "Users can view relevant shoutouts" 
ON public.shoutouts 
FOR SELECT 
USING (
  auth.uid() = from_user_id 
  OR auth.uid() = to_user_id 
  OR is_featured = true
);