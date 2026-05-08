-- Criar tabela players
CREATE TABLE IF NOT EXISTS players (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  phase_level INTEGER DEFAULT 1,
  score INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  daily_streak INTEGER DEFAULT 0,
  last_session_time FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices pra performance
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_players_updated_at ON players(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_players_total_score ON players(total_score DESC);

-- Criar tabela sessions (histórico detalhado)
CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  phase_level INTEGER,
  score INTEGER,
  duration_seconds FLOAT,
  completed_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES players(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at ON sessions(completed_at DESC);

-- Criar views pra métricas rápidas
CREATE OR REPLACE VIEW daily_metrics AS
SELECT
  DATE(updated_at) as date,
  COUNT(DISTINCT user_id) as dau,
  AVG(total_score) as avg_score,
  AVG(total_sessions) as avg_sessions,
  AVG(daily_streak) as avg_streak
FROM players
WHERE updated_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(updated_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW retention_metrics AS
SELECT
  COUNT(DISTINCT CASE WHEN updated_at >= NOW() - INTERVAL '1 day' THEN user_id END) as d0,
  COUNT(DISTINCT CASE WHEN updated_at >= NOW() - INTERVAL '2 days' AND updated_at < NOW() - INTERVAL '1 day' THEN user_id END) as d1,
  COUNT(DISTINCT CASE WHEN updated_at >= NOW() - INTERVAL '8 days' AND updated_at < NOW() - INTERVAL '7 days' THEN user_id END) as d7
FROM players;

-- Habilitar realtime (opcional)
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
