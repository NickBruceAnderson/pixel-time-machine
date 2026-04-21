# Pixel Time Machine — CLAUDE.md

## Project Overview
One playable browser game per year, starting in 1972. Each folder is a year, each year is a demake of a landmark game from that era. Built to last — the same stack scales from Pong to Vampire Survivors-tier complexity.

## The Vision
- 1972 — Pong
- 1973 — (next)
- ...continuing forward through gaming history

## Stack
- Phaser 3 via CDN (no bundler, no build step, ever — the game runs by opening index.html)
- Vanilla JS — readable by a human at all times
- GitHub Pages — auto-deploys on push to main
- Claude Code — primary builder
- Wispr Flow — voice input

## IntelliSense Setup
`npm` is installed **for type definitions only** — it does not affect how the game runs.
- `node_modules/phaser` provides hover docs and autocomplete in Cursor/VS Code
- `jsconfig.json` at the repo root wires up JS type checking
- Each `game.js` starts with `/// <reference types="phaser" />` so the editor sees Phaser's types
- `node_modules/` is gitignored — run `npm install` after cloning to restore hover docs

## Folder Structure
Each year is self-contained, named `year-game-name`:

    1972-pong/
      index.html   <- loads Phaser via CDN, entry point
      game.js      <- all game logic

## Developer Profile
Nick has a CS degree (Stevens, 2006-2012). He reviews code but does not write it. He should be able to read any file and understand it. He will manually tweak magic numbers himself once he knows where they are.

## Code Philosophy
- Every tunable value (speed, size, timing) must have a comment explaining what it does
- Prefer readability over cleverness
- Use the most performant data structures — no bubble sorts, prefer hash maps where appropriate
- No runtime dependencies beyond Phaser 3 CDN (npm is for editor types only)
- Each game must run by simply opening index.html in a browser

## Game Feel Philosophy
Small numbers, meaningful increments. Inspired by Paper Mario's damage system — a +1 feels like something. Avoid inflating numbers. Keep scores, values, and stats human-readable and satisfying at low magnitudes.

## Git Workflow
After every feature or working state: commit and push. Green light every day is the goal. Commit messages should be descriptive (e.g. "Add ball collision physics" not "update").

## Running Locally
Open `1972-pong/index.html` directly in any browser. No build step needed.
Alternatively: `npx serve 1972-pong`

## Current Game
1972 — Pong
- Two paddles, one ball, score tracking
- Keyboard controls: W/S for left paddle, Up/Down for right
- Single index.html + game.js in /1972-pong folder