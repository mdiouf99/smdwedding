import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 5 } },
});

export type RsvpRow = {
  id: string;
  name: string;
  // null while pending (guest added but hasn't responded yet)
  attending: boolean | null;
  token: string;
  arrived: boolean;
  responded_at: string | null;
  created_at: string;
};

export type WishRow = {
  id: string;
  name: string;
  message: string;
  hearts: number;
  created_at: string;
};

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder');
