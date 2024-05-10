import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gryutijpcsscbtcauzxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyeXV0aWpwY3NzY2J0Y2F1enh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM0NDUxMzAsImV4cCI6MjAyOTAyMTEzMH0.d-l5udqIhKmyq1PbOBFGBUZ7OVzPKISQr-6o5iV5DHk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
