import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pueoumkuxzosxrzqoefw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZW91bWt1eHpvc3hyenFvZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NjMzMjEsImV4cCI6MjAzODUzOTMyMX0.QJnUIlCJU3ZkEBqkwBZSkOrON8qf15xfaVQw50y2hJw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
