// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mcpozbbuwowjabcpaxld.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcG96YmJ1d293amFiY3BheGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDU2MDcsImV4cCI6MjA2OTAyMTYwN30.0MESOr7M4VJM1pib0bFQp4MVBg98uIS6G1T9wgC2ces";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
