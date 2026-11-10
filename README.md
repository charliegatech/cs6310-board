# CS6310 Team Board

A lightweight Jira-style ticket board for a CS6310 team project. Create, edit, search, and drag tickets across Backlog → To Do → In Progress → In Review → Done.

Everyone shares one live JSON document, `board.json`. Creating, editing, or moving a ticket writes that file. **Refresh** pulls the latest copy so the whole team sees the same tickets. On Netlify the file is stored with Netlify Blobs. During `npm run dev` it is written to `data/board.json` on this computer.

## Features

- Kanban board with drag-and-drop status changes
- Create / edit / delete tickets (`CS6310-#` keys)
- Types: story, task, bug, epic
- Priority, assignee, story points, labels
- Search and assignee filters
- **Refresh** reloads the current `board.json` and does not add tickets

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Deploy to GitHub

1. Create a new empty repository on GitHub (no README if this folder already has one).
2. From this project folder:

```bash
git add .
git commit -m "feat: add CS6310 team ticket board"
git branch -M main
git remote add origin https://github.com/charliegatech/cs6310-board.git
git push -u origin main
```

## Deploy to Netlify

### Option A — Import from GitHub (recommended)

1. Push the repo to GitHub (steps above).
2. Go to [https://app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Pick the GitHub repo.
4. Build settings (also in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Deploy. Netlify will rebuild on every push to `main`.

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify login
netlify init
netlify deploy --prod
```

## Notes

- The live board is `/board.json`. Netlify rewrites that URL to a function, so do not replace it with a static file.
- The site has to be deployed from this GitHub repo (not a manual upload of `dist` only) so the function is included.
- Two people editing at the same moment: the last save wins. Hit Refresh before a long editing session if others are working.
- `netlify.toml` includes an SPA redirect so client routes keep working on refresh.
