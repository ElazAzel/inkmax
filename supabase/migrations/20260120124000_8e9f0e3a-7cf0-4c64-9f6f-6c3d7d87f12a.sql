-- Event Pro gating and helpers
CREATE OR REPLACE FUNCTION public.is_premium_user(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = p_user_id
      AND (
        is_premium = true
        OR (trial_ends_at IS NOT NULL AND trial_ends_at > now())
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.event_form_has_pro_fields(p_form jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT jsonb_path_exists(p_form, '$[*] ? (@.type == "media" || @.type == "file")');
$$;

DROP POLICY IF EXISTS "Owners manage events" ON public.events;

CREATE POLICY "Owners can insert events"
ON public.events
FOR INSERT
WITH CHECK (
  auth.uid() = owner_id
  AND (
    public.is_premium_user(auth.uid())
    OR (
      (is_paid IS NULL OR is_paid = false)
      AND NOT public.event_form_has_pro_fields(form_schema_json)
    )
  )
);

CREATE POLICY "Owners can update events"
ON public.events
FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (
  auth.uid() = owner_id
  AND (
    public.is_premium_user(auth.uid())
    OR (
      (is_paid IS NULL OR is_paid = false)
      AND NOT public.event_form_has_pro_fields(form_schema_json)
    )
  )
);

CREATE POLICY "Owners can delete events"
ON public.events
FOR DELETE
USING (auth.uid() = owner_id);
