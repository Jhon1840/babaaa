import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qbymoxgxlzamxhonbwdd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieW1veGd4bHphbXhob25id2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzODQ4MjcsImV4cCI6MjAzMDk2MDgyN30.BlsOkzyg0m4KnjEqWvA7SkeEMbrKF0bJKJgGU6ghOas";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
