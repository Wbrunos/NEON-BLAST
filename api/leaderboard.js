import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '');
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY);

    const { data, error } = await supabase
      .from('players')
      .select('user_id, total_score, daily_streak')
      .order('total_score', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error('Leaderboard API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
