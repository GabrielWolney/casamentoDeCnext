import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfbtkaxrpupdyroetxzq.supabase.co';
// Use a chave pública (anon key) que você tinha no seu Vanilla JS
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYnRrYXhycHVwZHlyb2V0eHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjEwMjgsImV4cCI6MjA4NjIzNzAyOH0.tkcqsOYCyD8Dw6jtr2DzKp77rlunOVxrdfkrIDx9MZk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);