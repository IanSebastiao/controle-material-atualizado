import { createClient } from '@supabase/supabase-js';

// ⚠️ Idealmente, coloque as variáveis no .env.local
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; 'https://mkhzwqfpayjgbzmbfjfn.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY; 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raHp3cWZwYXlqZ2J6bWJmamZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTEyNjYsImV4cCI6MjA2NDgyNzI2Nn0.F-_2kyN2lEXvtgY8c0XbWZmlAESVzlBd3Uv6NiaOBD4';


export const supabase2 = createClient(supabaseUrl, supabaseKey);
