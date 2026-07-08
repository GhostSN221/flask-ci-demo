const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const START_TIME = Date.now();

const HIDDEN = new Set(['TOKEN', 'SECRET', 'PASSWORD', 'KEY', 'PWD', 'PASS']);
const safeEnvVars = () =>
  Object.fromEntries(
    Object.entries(process.env).filter(
      ([k]) => !Array.from(HIDDEN).some((h) => k.toUpperCase().includes(h))
    )
  );

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: Math.floor((Date.now() - START_TIME) / 1000) });
});

app.get('/ping', (req, res) => {
  res.json({ pong: true, ts: new Date().toISOString() });
});

app.get('/info', (req, res) => {
  res.json({
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    node: process.version,
    memory: {
      total_mb: Math.round(os.totalmem() / 1024 / 1024),
      free_mb: Math.round(os.freemem() / 1024 / 1024),
      used_mb: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
    },
    uptime_s: Math.floor((Date.now() - START_TIME) / 1000),
    env: safeEnvVars(),
    headers: req.headers,
  });
});

app.get('/', (req, res) => {
  const uptime = Math.floor((Date.now() - START_TIME) / 1000);
  const memUsed = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
  const memTotal = Math.round(os.totalmem() / 1024 / 1024);
  const env = safeEnvVars();
  const envRows = Object.entries(env)
    .slice(0, 20)
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
    .join('');

  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SystalinkCloud — Test App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    header { background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 2rem; border-bottom: 1px solid #1e40af; }
    header h1 { font-size: 1.6rem; font-weight: 700; color: #60a5fa; }
    header p { color: #94a3b8; margin-top: 0.25rem; font-size: 0.9rem; }
    .badge { display: inline-block; background: #16a34a; color: #fff; font-size: 0.75rem; padding: 2px 10px; border-radius: 9999px; margin-left: 0.75rem; vertical-align: middle; }
    main { max-width: 960px; margin: 2rem auto; padding: 0 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.25rem; }
    .card h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 1rem; }
    .stat { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #1e3a5f; }
    .stat:last-child { border-bottom: none; }
    .stat .label { color: #94a3b8; font-size: 0.88rem; }
    .stat .value { color: #f1f5f9; font-size: 0.88rem; font-family: monospace; }
    .progress-bar { background: #1e3a5f; border-radius: 4px; height: 6px; margin-top: 4px; }
    .progress-fill { background: #3b82f6; border-radius: 4px; height: 6px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th { text-align: left; color: #64748b; padding: 0.4rem 0.5rem; border-bottom: 1px solid #1e3a5f; }
    td { padding: 0.4rem 0.5rem; border-bottom: 1px solid #1e293b; font-family: monospace; word-break: break-all; }
    td:first-child { color: #93c5fd; white-space: nowrap; }
    .full-width { grid-column: 1 / -1; }
    .endpoints { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .ep { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 0.35rem 0.75rem; font-family: monospace; font-size: 0.8rem; color: #34d399; }
    footer { text-align: center; padding: 2rem; color: #475569; font-size: 0.8rem; }
  </style>
</head>
<body>
  <header>
    <h1>SystalinkCloud Test App <span class="badge">RUNNING</span></h1>
    <p>Node.js ${process.version} · Express 4 · Container ${os.hostname()}</p>
  </header>
  <main>
    <div class="card">
      <h2>Container Info</h2>
      <div class="stat"><span class="label">Hostname</span><span class="value">${os.hostname()}</span></div>
      <div class="stat"><span class="label">Platform</span><span class="value">${os.platform()}/${os.arch()}</span></div>
      <div class="stat"><span class="label">Node.js</span><span class="value">${process.version}</span></div>
      <div class="stat"><span class="label">PID</span><span class="value">${process.pid}</span></div>
      <div class="stat"><span class="label">Uptime</span><span class="value">${uptime}s</span></div>
    </div>
    <div class="card">
      <h2>Memory</h2>
      <div class="stat"><span class="label">Used</span><span class="value">${memUsed} MB</span></div>
      <div class="stat"><span class="label">Total</span><span class="value">${memTotal} MB</span></div>
      <div style="padding:0.75rem 0">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.min(100, Math.round(memUsed/memTotal*100))}%"></div>
        </div>
        <div style="text-align:right;font-size:0.75rem;color:#64748b;margin-top:4px">${Math.round(memUsed/memTotal*100)}%</div>
      </div>
    </div>
    <div class="card full-width">
      <h2>API Endpoints</h2>
      <div class="endpoints">
        <span class="ep">GET /</span>
        <span class="ep">GET /health</span>
        <span class="ep">GET /ping</span>
        <span class="ep">GET /info</span>
      </div>
    </div>
    <div class="card full-width">
      <h2>Environment Variables (${Object.keys(env).length} vars — secrets masqués)</h2>
      <table>
        <thead><tr><th>Variable</th><th>Value</th></tr></thead>
        <tbody>${envRows}</tbody>
      </table>
    </div>
  </main>
  <footer>flask-ci-demo · SystalinkCloud Datacloud · Deployed on K8s</footer>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Hostname: ${os.hostname()}`);
});
