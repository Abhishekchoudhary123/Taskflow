const dns    = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS — fixes querySrv on restrictive routers

const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const connectDB = require('./config/db');

dotenv.config();

// ── Startup diagnostics (remove after confirming deploy) ──
console.log('🔍 ENV CHECK:');
console.log('  MONGODB_URI present:', !!process.env.MONGODB_URI);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);

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

// ── Health check ──────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Serve React build in production ───────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) =>
    res.sendFile(path.join(distPath, 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));

