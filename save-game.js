import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase config missing');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      user_id,
      phase_level,
      score,
      total_sessions,
      total_score,
      daily_streak,
      session_time,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('players')
      .upsert(
        {
          user_id,
          phase_level,
          score,
          total_sessions,
          total_score,
          daily_streak,
          last_session_time: session_time,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
