// Conexão com o Supabase (banco de dados na nuvem, substitui o localStorage)
var SUPABASE_URL = "https://llppdshajtirxedhbhgv.supabase.co";
var SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHBkc2hhanRpcnhlZGhiaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNDI5OTcsImV4cCI6MjEwMzYxODk5N30.5vL0PG5fv82h_bQPiwOkqH233obkVBwJ5cRD1v_M1n0";

var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
