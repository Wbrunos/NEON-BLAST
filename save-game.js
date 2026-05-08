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

    // 1. Update Player Record
    const { data: playerData, error: playerError } = await supabase
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

    if (playerError) {
      console.error('Player update error:', playerError);
      return res.status(500).json({ error: 'Database error (players)' });
    }

    // 2. Record Session History
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id,
        phase_level,
        score,
        duration_seconds: session_time,
        completed_at: new Date().toISOString()
      });

    if (sessionError) {
      console.error('Session record error:', sessionError);
      // We don't fail the whole request if only the history fails
    }

    res.status(200).json({ success: true, data: playerData });
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
