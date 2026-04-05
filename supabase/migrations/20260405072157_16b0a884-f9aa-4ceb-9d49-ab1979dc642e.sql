
-- Schedule keep-alive ping every 5 days (at midnight UTC)
SELECT cron.schedule(
  'keep-alive-ping',
  '0 0 */5 * *',
  $$
  SELECT net.http_get(
    url := current_setting('app.settings.supabase_url', true) || '/functions/v1/keep-alive',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key', true)
    )
  );
  $$
);
