import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://mkhzwqfpayjgbzmbfjfn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raHp3cWZwYXlqZ2J6bWJmamZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTEyNjYsImV4cCI6MjA2NDgyNzI2Nn0.F-_2kyN2lEXvtgY8c0XbWZmlAESVzlBd3Uv6NiaOBD4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);