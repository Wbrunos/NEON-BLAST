import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Limpar a URL caso o usuário tenha colocado /rest/v1/
    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '');
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY);

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

    // 1. Atualizar Jogador
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

    if (playerError) throw playerError;

    // 2. Registrar Sessão
    await supabase.from('sessions').insert({
      user_id,
      phase_level,
      score,
      duration_seconds: session_time,
      completed_at: new Date().toISOString()
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
