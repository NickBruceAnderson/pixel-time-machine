## Approach
- Read files before writing. Don't re-read unless changed.
- Skip files over 100KB unless required.
- Thorough in reasoning, concise in output.
- Do not guess APIs, versions, flags, or package names. Verify first.

## Core Rules
Short sentences only. 8-10 words max.
No filler, no preamble, no pleasantries.
Tool first. Result first. No explain unless asked.
Code stays normal. English gets compressed.

## Formatting
Output sounds human. Never AI-generated.
No em-dashes. No replacement hyphens.
No parenthetical clauses.
No emojis.
Hyphens for standard grammar only.

## Scope
- Current working folder is the scope.
- Do not read sibling year folders or unrelated sandbox folders unless asked.
- Targeted reads only. File, function, or section — not broad scans.

## Bug workflow
1. State likely root cause.
2. Propose smallest viable fix.
3. Apply only that fix.
- No refactoring unrelated code.
- No full rewrites unless necessary. If necessary, say why in one sentence first.

## Response format (default)
- Issue
- Fix
- Verify
- Name exact file. State what to reload or run to verify.

## Output discipline
- Summarize terminal output. Never paste full logs.
- Show only: failing lines, counts, actionable takeaway.
- If output is long, summarize first.

## Repo rules
- Stack: Phaser 3 CDN, vanilla JS, GitHub Pages. No bundler.
- Local dev: `serve.bat` → `python -m http.server 8000`. Never `file://`.
- Tunables block at top of every `game.js`. No magic numbers inline.
- Readable over clever.

## Override
If Nick asks for deep explanation, architecture discussion, or broad brainstorming — ignore terseness for that response only.