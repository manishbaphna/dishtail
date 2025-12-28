-- Fix: Restrict analytics inserts to authenticated users only
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.site_analytics;

-- Create a new policy that only allows authenticated users to insert analytics
CREATE POLICY "Authenticated users can insert analytics"
ON public.site_analytics
FOR INSERT
TO authenticated
WITH CHECK (true);