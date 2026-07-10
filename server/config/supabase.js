import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables. Database integration will run in offline/mock fallback mode.');
}

export const supabase = (supabaseUrl && supabaseServiceKey && process.env.USE_SUPABASE === 'true') 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export default supabase;
