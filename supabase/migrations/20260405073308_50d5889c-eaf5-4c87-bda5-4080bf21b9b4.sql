
-- Fix 1: Profiles - restrict SELECT to owner + admins
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- Fix 2: Harden is_admin() to use auth.uid() joined with auth.users
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_emails ae
    JOIN auth.users u ON u.email = ae.email
    WHERE u.id = auth.uid()
  );
$$;

-- Fix 3: Update admin_emails SELECT policy to use improved is_admin()
DROP POLICY IF EXISTS "Only admins can view admin emails" ON public.admin_emails;

CREATE POLICY "Only admins can view admin emails"
  ON public.admin_emails FOR SELECT
  TO authenticated
  USING (is_admin());
