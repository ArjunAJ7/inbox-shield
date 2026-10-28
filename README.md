# Inbox Shield

Triage an inbound customer message before an AI assistant or a teammate acts on it.
Built for the Clocked Build Challenge on the [Clocked API](https://clocked.rezolve.ai/docs).

**Live demo:** https://inbox-shield.arjun-vinod0028.workers.dev (no login, free to use, 20 runs per hour per visitor)

## What it does

You paste a message. Inbox Shield:

1. **Guard** (`/injection`) checks the message as untrusted content. If it tries to give orders to whoever reads it, the flagged sentences are cut out of the message using the evidence spans Clocked returns, and shown separately for a person to review.
2. **Protect** (`/pii`) masks names, emails, phones, addresses and card numbers in the cleaned text.
3. **Decide** (`/decide`) routes the ticket (refund, shipping, technical, other) and says whether it is urgent, with probabilities.
4. **Extract** (`/extract`) copies out the order or ticket number, the product and any deadline, verbatim.

The output is a "filtered text" block (personal data masked, flagged sentences removed) that a person can review before an assistant uses it, plus the route, urgency and facts. The Clocked results change what the app does: flagged text is removed, personal data is masked, and the route and urgency decide where the ticket goes.

Two Clocked calls per run (Guard first, then Protect, Decide and Extract as one pipeline on the cleaned text).

## Test it

Open the live demo and use the four example buttons:

- "Refund + hidden instruction": the last sentence is removed, name, email and phone are masked, route is refund and urgent, order A-48213 is extracted.
- "Plain delivery question": no attack found, routed to shipping, name and address masked.
- "Account fault": routed to technical, urgent.
- "Assistant takeover attempt": the whole message is flagged and removed.

You can also paste your own message (up to 4,000 characters).

## Run it yourself

Node 18 or newer, no dependencies.

```
export CLOCKED_API_KEY=your_key
node server.js
# open http://localhost:8787
```

It also deploys as a Cloudflare Worker (`worker.js` is the whole app, `wrangler.toml` is included). Set the key as a secret named `CLOCKED_API_KEY`. The key stays on the server and is never sent to the browser.

## Limits

- Detection can miss things. Treat it as a first filter and keep a person in the loop for anything important.
- The filtered text is reviewed by Clocked checks, not guaranteed safe. Keep a person in the loop, and do not paste real private messages into the public demo; the examples are synthetic.
- The demo rate limit is kept in memory per server instance, so it is a courtesy limit, not a hard guarantee.
- Built during the challenge window with AI coding assistance. All code in this repository was written for this project.

## License

MIT
