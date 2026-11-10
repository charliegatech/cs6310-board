# CS6310 Team Board

A lightweight Jira-style ticket board for a CS6310 team project. Create, edit, search, and drag tickets across Backlog → To Do → In Progress → In Review → Done. Data is stored in the browser (`localStorage`), so the app is a static site you can push to GitHub and host on Netlify for free.

## Features

- Kanban board with drag-and-drop status changes
- Create / edit / delete tickets (`CS6310-#` keys)
- Types: story, task, bug, epic
- Priority, assignee, story points, labels
- Search and assignee filters
- Sample CS6310 ride-sharing project tickets included
- **Reset demo** restores the seed data

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

- Tickets live in each visitor’s browser storage. Teammates do **not** share a live board unless you later add a backend.
- `netlify.toml` includes an SPA redirect so client routes keep working on refresh.
