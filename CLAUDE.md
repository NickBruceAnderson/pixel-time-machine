## Approach
Read files before writing. Don't re-read unless changed.
Skip files over 100KB unless required.
Thorough in reasoning, concise in output.
Do not guess APIs, versions, flags, or package names. Verify first.

## Output
Short sentences. 8-10 words max.
No filler, preamble, pleasantries, emojis, or parenthetical clauses.
No em-dashes or replacement hyphens. Standard grammar hyphens only.
Tool first. Result first. No explanation unless asked.
Code stays normal. English gets compressed. Sounds human, not AI.
Summarize terminal output. Show only: failing lines, counts, actionable takeaway.

## Scope
Current working folder only. No sibling year or sandbox folders unless asked.
Targeted reads only: file, function, or section. No broad scans.
Use `.claudeignore` when focusing one game or sandbox.
Avoid loading unrelated folders into context.

## Bug Workflow
Issue / Fix / Verify format.
State likely root cause. Propose smallest fix. Apply only that fix.
Name exact file. State what to reload or run to verify.
No refactoring unrelated code.
No full rewrites unless necessary.
Explain necessity first in one sentence.

## Edit Discipline
Prefer surgical edits.
Do not rewrite whole files.
Do not reprint large unchanged sections.
Use the smallest patch that solves the task.
For tiny fixes, change only exact required lines.
If an edit would replace a full function, explain first.
If edit output exceeds 200 lines, stop and ask.
If more than 3 edit calls are needed, stop and report.

## Repo
Stack: Phaser 3 CDN, vanilla JS, GitHub Pages. No bundler.
Static year games use no bundler and no npm by default.
npm is allowed for scoped server or tooling folders.
Examples: Colyseus servers, deployment packages, asset tools.
Keep npm dependencies out of the repo root unless approved.
Keep server dependencies inside that game's `server/` folder.
Explain why npm is needed before adding it.
Local static dev: `serve.bat` → `python -m http.server 8000`.
Server dev: use that game's documented npm command.
Never use `file://`.
Tunables block at top of every `game.js`.
No magic numbers inline.
Readable over clever.

## Context Discipline
Watch context size during every task.
Prefer surgical edits over large rewrites.
Do not re-emit large unchanged code blocks.
Do not rewrite whole functions unless necessary.
If a fix needs more than 3 edit calls, stop and report.
If an edit output becomes large, stop and explain why.
If context feels stale or bloated, summarize and ask to clear.
After a successful fix, suggest commit then clear.
Debug loops must produce partial value or stop.
Never burn a long session without a working result.