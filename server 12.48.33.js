import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import saveHandler from './api/save-game.js';
import leaderboardHandler from './api/leaderboard.js';

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

// Mock Vercel API behavior locally
app.post('/api/save-game', async (req, res) => {
  await saveHandler(req, res);
});

app.get('/api/leaderboard', async (req, res) => {
  await leaderboardHandler(req, res);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`NEON BLAST running locally at http://localhost:${port}`);
});
