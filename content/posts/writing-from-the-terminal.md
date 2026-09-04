---
title: Writing from the terminal
date: 2026-09-04
description: plain now ships skills for Claude Code, so a post can start as a sentence you say out loud.
tags:
  - notes
---

Your site is a folder of files. That was always the point — no database, no export step, nothing locked away where you can't reach it. It also means an AI coding agent can run the whole thing, because everything it needs is already on disk.

What was missing was the *how*. An agent opening your repository could read the engine documentation end to end and still get the small things wrong: which fields your posts require, that the filename is the URL, that renaming a file without leaving a redirect quietly breaks every link anyone ever made to it.

So this version ships the how. Three skills live in `.claude/skills/`, and Claude Code picks them up the moment you open the repository:

- **plain-post** — write, edit, publish, unpublish or translate a post or page.
- **plain-site** — images, the menu, settings, redirects, themes, plugins, languages, deploys.
- **plain-extend** — add a field, a whole content type, a landing page, a plugin.

Which means "write a post about the three things I learned launching this site" is now a sentence you say, and what comes back is a real file, in the right folder, with the right frontmatter.

## It reads your schema, not its memory

Before writing a line, the agent prints your collection's fields out of `site.config.json`. If you've added an author field, or made the cover image required, the post has it the first time — no guessing, no second pass.

Then it runs the tests and a build. If something is wrong, the build stops and names the file, the line, the problem, and the fix. That check was always there; the skills just make sure it always runs before anything is committed. A broken post never reaches your readers.

## Publishing is still yours

The permission list that ships alongside covers building and looking around — never commit, never push. The agent writes and verifies; you read it and decide whether it goes out.

That seemed like the only sensible default for something that writes in your voice, on your website.

If you use a different tool, the skills are plain Markdown. Point anything at `.claude/skills/` and it gets the same instructions.

Existing sites pick all of this up on the next update — click **Update available** in the admin and it arrives as a pull request, like every other change.

The files are still yours. The fiddly business of getting them into the right shape, a little less so.
