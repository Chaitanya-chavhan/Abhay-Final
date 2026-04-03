
DROP VIEW IF EXISTS public.products_public;

CREATE VIEW public.products_public WITH (security_invoker = true) AS
SELECT id, title, description, price, original_price, category, image_url, features, tag, is_active, created_at, updated_at
FROM public.products
WHERE is_active = true;
