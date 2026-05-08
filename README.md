# SWAP BLAST - Puzzle Game com Dashboard

Um jogo de puzzle viciante em HTML5/Canvas que carrega em <2s, com dashboard tempo real, sistema de Daily Streak, e pronto pra monetização com ads.

## 📋 Requisitos

- Conta Vercel (free)
- Projeto Supabase (free tier)
- GitHub (pra versioning)

## 🚀 Deploy em 5 Passos

### 1. Criar Projeto Supabase

1. Vá pra [supabase.com](https://supabase.com)
2. Clique "New Project"
3. Preencha:
   - **Project name**: `swap-blast`
   - **Password**: guarde bem
   - **Region**: `South America (São Paulo)` (mais perto de BR)
4. Espera criar (~2 min)
5. Salve:
   - **Project URL** → vai em Settings > API
   - **Anon Key** → vai em Settings > API

### 2. Criar Tabelas no Supabase

1. Abra SQL Editor
2. Cole todo conteúdo de `database.sql`
3. Clique "Run"

Pronto! Agora você tem:
- `players` table (dados dos jogadores)
- `sessions` table (histórico)
- 2 views de métricas (daily_metrics, retention_metrics)

### 3. Push pro GitHub

```bash
git init
git add .
git commit -m "Initial SWAP BLAST commit"
git remote add origin https://github.com/seu-user/swap-blast
git push -u origin main
```

### 4. Deploy no Vercel

```bash
npm install -g vercel
vercel --prod
```

Na primeira vez, Vercel vai pedir:
- **Scope**: seu username
- **Project name**: `swap-blast`
- **Root directory**: `.` (ponto)

### 5. Adicionar Variáveis de Ambiente

1. Vá em Vercel Dashboard > seu projeto
2. Settings > Environment Variables
3. Adicione 2:
   - **SUPABASE_URL** = (cole aqui de Supabase Settings > API)
   - **SUPABASE_ANON_KEY** = (cole aqui de Supabase Settings > API)
4. Redeploy (clique "Redeploy")

**Pronto! Seu jogo tá online em:** `seu-projeto.vercel.app`

---

## 🎮 Como Funciona

### Jogo (HTML5/Canvas)
- **Grid 5x5** com blocos coloridos
- **Swap adjacente**: clica 2 blocos lado-a-lado pra trocar
- **Match 3+**: quando alinha, desaparece e soma pontos
- **Fases**: progressão de 1-20, dificuldade aumenta
- **Daily Streak**: volta amanhã = +1 no contador

### Dashboard
- **Métricas em tempo real** (atualiza a cada 5s)
- **DAU** (quem tá jogando agora)
- **Retention** (quantos voltaram)
- **Session time** (tempo médio)
- **Streak counter** (dias consecutivos)

### LocalStorage + Supabase
- Dados do jogo salvam **localmente** (localStorage) → carrega rápido
- Background sync pro Supabase a cada sessão termina
- Se internet cair, jogo continua funcionando offline

---

## 💰 Monetização (Próximas Passos)

### Ads (Google AdMob)
1. Crie conta [Google AdMob](https://admob.google.com)
2. Crie App Publisher
3. Adicione `<script>` de ad network no HTML:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX"></script>
```
4. Coloque ads:
   - Entre fases (recompensa "+5 moves" por ver ad)
   - Gameover screen

### Monetização Realista
Você vai ganhar:
- **CPM (Brasil)**: R$ 0,50-0,80 por 1000 impressões
- **100k DAU, 2 sessões/dia, 1 ad/sessão**:
  - 100k × 2 × 0,70 ÷ 1000 = **R$ 140/dia**
  - **R$ 4.200/mês**

Mas precisa de +500k DAU pra valer. Leva 3-6 meses com boa estratégia.

### Power-ups Pagos (In-app)
Ainda não implementado, mas quer adicionar? Opções:
- "Bomb" = limpa 3x3 (R$ 5)
- "Shuffle" = embaralha (R$ 3)
- "+5 Moves" (R$ 8)

---

## 📊 Métricas Principais

Acompanhe no Supabase:

```sql
-- DAU (Daily Active Users)
SELECT COUNT(DISTINCT user_id) FROM players
WHERE updated_at >= NOW() - INTERVAL '1 day';

-- Retention D1
SELECT 
  COUNT(DISTINCT CASE WHEN updated_at >= NOW() - INTERVAL '1 day' THEN user_id END) as d0,
  COUNT(DISTINCT CASE WHEN updated_at >= NOW() - INTERVAL '2 days' AND updated_at < NOW() - INTERVAL '1 day' THEN user_id END) as d1
FROM players;

-- Score médio
SELECT AVG(total_score) FROM players;

-- Top 10 players
SELECT user_id, total_score FROM players ORDER BY total_score DESC LIMIT 10;
```

---

## ⚠️ O Que Você Precisa Saber

### Pontos Fracos do MVP
1. **Sem leaderboard global** → implementar depois (caro em real-time)
2. **Sem PvP** → add semana 2
3. **Sem analytics avançada** → Google Analytics depois
4. **Ads não tão integrados** → precisa do AdMob setup

### Por Que Vai Falhar
1. **Sem marketing** → 0 downloads, 0 receita
2. **Sem SEO/ASO** → ninguém acha seu jogo
3. **Saída muito rápida** → demos 2 semanas e desiste
4. **Espera ganhar $ rápido** → leva 3-6 meses

### Como Não Falhar
1. **Mês 1**: Lança + coleta feedback de 100 pessoas
2. **Mês 2**: Melhora mecanica + adds features (leaderboard, skins)
3. **Mês 3**: Marketing no TikTok/YouTube (game clips virais)
4. **Mês 4+**: Monetização (ads + power-ups)

---

## 🔧 Comandos Úteis

```bash
# Testar localmente
npm run dev
# Acessa http://localhost:3000

# Deploy
npm run deploy

# Ver logs do servidor
vercel logs

# Rollback última versão
vercel rollback
```

---

## 📝 Próximas Features (Roadmap)

- [ ] Leaderboard global
- [ ] Sistema de skins (cores)
- [ ] PvP modo (desafios entre amigos)
- [ ] Modo story (campanha com boss final)
- [ ] Video ads com reward
- [ ] Webhook Discord pra high scores
- [ ] Push notifications (quando streak tá caindo)
- [ ] Analytics dashboard avançado

---

## 🤔 Dúvidas?

**"Posso monetizar antes de ter usuários?"**
Não. Ads só valem com +5k MAU. Antes disso, focus em retenção.

**"Quanto custa hospedar?"**
Vercel free = até 100GB bandwidth/mês (suficiente). Supabase free = até 500MB banco.

**"E se quebrar?"**
GitHub está versioning, rollback é 1 clique.

---

**Feito com ❤️ pra devs brasileiros.**
Deploy no Vercel é grátis, Supabase é grátis, só falta o hustle. 💪
