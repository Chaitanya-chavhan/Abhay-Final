
-- Remove public SELECT on products table (exposes drive_link)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

-- Only admins can SELECT from products table directly
CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (is_admin());
