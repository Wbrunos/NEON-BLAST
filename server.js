import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from './save-game.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Set permissive CSP for local development
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data:; font-src *;");
  next();
});

app.use(express.static('.'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'swap-blast-complete.html'));
});

// Mock Vercel API behavior
app.post('/api/save-game', async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from('players')
      .select('user_id, total_score, daily_streak')
      .order('total_score', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Leaderboard Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`SWAP BLAST running at http://localhost:${port}`);
});
