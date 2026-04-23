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

## Bug Workflow
Issue / Fix / Verify format.
State likely root cause. Propose smallest fix. Apply only that fix.
Name exact file. State what to reload or run to verify.
No refactoring unrelated code. No full rewrites unless necessary — say why first in one sentence.

## Repo
Stack: Phaser 3 CDN, vanilla JS, GitHub Pages. No bundler.
Local dev: `serve.bat` → `python -m http.server 8000`. Never `file://`.
Tunables block at top of every `game.js`. No magic numbers inline.
Readable over clever.

## Override
If Nick asks for deep explanation, architecture discussion, or broad brainstorming — ignore terseness for that response only.