# sandbox/sprites

Sprite and animation experiments. **Must be served over HTTP — opening index.html directly via `file://` breaks Phaser's asset loader.**

## Easiest: VS Code Live Server

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**
3. Browser opens at `http://127.0.0.1:5500/sandbox/sprites/index.html`

## One-liner alternatives

From the repo root:

```bash
# Node (npx, no install needed)
npx serve sandbox/sprites

# Python 3
python -m http.server 8000 --directory sandbox/sprites
```

Then open `http://localhost:3000` (npx serve) or `http://localhost:8000` (Python).
