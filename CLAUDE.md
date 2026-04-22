# Pixel Time Machine — Project Context

## What this is
A browser-based game demake project. One game per year starting 1972. Built with Phaser 3 + Claude Code. Nick drives with voice (Wispr Flow), Claude Code builds, Nick reviews.

## Stack
- Phaser 3 via CDN (no bundler ever)
- Vanilla JS
- GitHub Pages (auto-deploys on push to main)
- Claude Code — primary builder
- VS Code with Claude Code extension — IDE and code viewer (Cursor removed)
- Wispr Flow — voice input

## Repo
https://github.com/NickBruceAnderson/pixel-time-machine

## Folder convention
- Games: `year-game-name` (e.g. 1972-pong, 1973-pong2)
- Sandbox: `sandbox/topic-name` (e.g. sandbox/sprites) — permanent experiment area, never shipped

## Completed
- 1972-pong — fully working, shipped, live on GitHub Pages
- 1973-pong2 — MVP complete, smash mechanic implemented

## In progress
- sandbox/sprites — Marle sprite walking demo, learning spritesheet workflow

## Nick's profile
CS degree (Stevens 2006-2012). Reads and reviews code, tweaks tunables manually in VS Code. Does not write code from scratch. Strong optimization instincts, prone to analysis paralysis on open-ended decisions — always push toward smallest next action. Wants pros and cons before recommendations, not just validation.

## Claude's role — architect first
- Flag things Nick hasn't asked about but should know
- Present tradeoffs before making recommendations
- Never just confirm what Nick wants to hear
- Format copy-paste prompts for Claude Code in code blocks
- Keep answers brief and bulleted
- If a decision has a wrong answer, say so directly

## Code philosophy
- All tunables at top of game.js with comments
- Readable over clever
- No dependencies beyond Phaser 3 CDN
- Every game runs via local server (serve.bat) or GitHub Pages — never file:// protocol

## serve.bat convention
Every folder with an index.html gets a serve.bat for local testing. Contents:
@echo off
start chrome http://localhost:8000
python -m http.server 8000
serve.bat is in .gitignore — local dev tool only.

## Game feel philosophy
Paper Mario damage system inspiration — small numbers, meaningful increments. A +1 should feel like something.

## Sprite workflow
- Frame size: 32x48, no margin
- Physics body offset always exposed as tunables
- Marle (marle2.png) animation map:
  - walk-down: frames 0-3
  - walk-right: frames 4-7
  - walk-left: frames 8-11
  - walk-up: frames 12-15

## Git workflow
- Commit and push after every working state
- 365 green lights is the goal
- Descriptive commit messages
- node_modules, serve.bat, .claude/ in .gitignore

## Next priorities
1. Fix Marle moonwalk + add WASD controls in sandbox/sprites
2. PHASER.md skill file in repo that grows with each game
3. 1974 game selection TBD
4. Eventually: Playwright tests for game logic
