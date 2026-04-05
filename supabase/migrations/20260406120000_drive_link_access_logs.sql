-- Audit trail when purchasers fetch a Drive link (Edge Function inserts via service role)
CREATE TABLE IF NOT EXISTS public.drive_link_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drive_link_access_logs_user_id ON public.drive_link_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_drive_link_access_logs_created_at ON public.drive_link_access_logs(created_at DESC);

ALTER TABLE public.drive_link_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view drive link access logs"
  ON public.drive_link_access_logs FOR SELECT
  TO authenticated
  USING (is_admin());
