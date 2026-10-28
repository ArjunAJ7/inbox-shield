// Local runner: CLOCKED_API_KEY=... node server.js   (Node 18+, no dependencies)
import http from 'node:http';
import app from './worker.js';

const port = process.env.PORT || 8787;
http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const r = await app.fetch(
    new Request('http://localhost' + req.url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body }),
    process.env
  );
  res.writeHead(r.status, Object.fromEntries(r.headers));
  res.end(Buffer.from(await r.arrayBuffer()));
}).listen(port, () => console.log('Inbox Shield on http://localhost:' + port));
