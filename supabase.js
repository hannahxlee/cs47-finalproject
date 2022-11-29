import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://ayphhgozdwrhpgnnsrgo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cGhoZ296ZHdyaHBnbm5zcmdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg1NTIyMjAsImV4cCI6MTk4NDEyODIyMH0.6iSeMQJlcTSVyoOW3dd3SvKXY6JKVdn3KUf-B9iE6qQ";

// const options = {
//   schema: "public",
//   headers: { "x-my-custom-header": "my-app-name" },
//   autoRefreshToken: true,
//   persistSession: true,
//   detectSessionInUrl: true,
// };

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
