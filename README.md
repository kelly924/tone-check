# Tone Check

A one-page internal tool. Someone pastes in a blunt or casual message, clicks
"Rewrite it," and gets back a professional version. No Claude account needed
for anyone using it, just the link.

## What you need before you deploy

1. **An Anthropic API key.** Get one at https://console.anthropic.com under
   "API Keys." This is billed separately from your claude.ai subscription,
   pay-per-use, and likely to be very cheap for a tool like this (a few
   cents per hundred rewrites).
2. **A place to host it.** The easiest option with no coding experience is
   Replit. Render and Vercel also work if you'd rather use those.

## Deploy on Replit (recommended, no install required)

1. Go to https://replit.com and create a free account if you don't have one.
2. Click **Create App** (or **+ Create Repl**), choose **Import from
   upload** / **Node.js**, and upload all four files in this folder
   (`server.js`, `package.json`, `README.md`, and the `public` folder with
   `index.html` inside it) keeping the same folder structure.
3. In the left sidebar, open **Secrets** (the padlock icon) and add:
   - `ANTHROPIC_API_KEY` → your API key from step 1 above
   - `ACCESS_CODE` → optional. If you set this, anyone using the tool has to
     type this code first. Recommended if the link could end up outside the
     company. Leave it unset if you don't want a code.
4. Click **Run**. Replit installs the dependency and starts the app.
5. Click **Deploy** in the top right to get a permanent public URL (the
   preview URL that shows while you're editing will change or sleep; Deploy
   gives you a stable one). Share that link with employees.

## Deploy on Render (also simple, free tier available)

1. Put these files in a GitHub repo (Kelly can ask Claude Code or a
   developer to help with this step if needed).
2. At https://render.com, create a **New Web Service**, connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Under **Environment**, add `ANTHROPIC_API_KEY` (and `ACCESS_CODE` if you
   want one).
5. Deploy. Render gives you a public `.onrender.com` URL.

## Customizing

- To use a custom domain (e.g. `tone.saintbernard.com`), most hosts let you
  add this under domain/DNS settings once deployed; it usually needs a
  CNAME record added wherever your company's domain is managed.
- To change the tone or add company-specific guidance (e.g. "avoid emoji,"
  "sign off with first name only"), edit the `system` instructions inside
  `server.js`.
- The page title and header text are in `public/index.html` if you want to
  rename it or add the Saint Bernard name.

## Cost and privacy notes

- Nothing typed into the tool is stored by this app; each request is
  stateless.
- You are billed by Anthropic based on usage of your API key, not a flat
  subscription. Keep an eye on usage at console.anthropic.com if the link
  gets shared more widely than intended, that's what the optional access
  code helps guard against.
