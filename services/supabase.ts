import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iojgiitystnfnyrshuhy.supabase.co';
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvamdpaXR5c3RuZm55cnNodWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY4NTM0MTQsImV4cCI6MTk5MjQyOTQxNH0.EXwL3nYSA0qtU19NEpAcATqwZLOtWXhqGXJavR8dbRA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
