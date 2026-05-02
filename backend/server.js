const dns    = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS — fixes querySrv on restrictive routers

const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks',    require('./routes/tasks'));
app.use('/api/users',    require('./routes/users'));

// ── Serve React build in production ───────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) =>
    res.sendFile(path.join(distPath, 'index.html'))
  );
}

// ── Health check ──────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
