---
title: A quieter way to run a website
description: A calm, Git-native CMS. Your content is Markdown in Git; your site is a fast static build. No database, no lock-in.
---

Websites used to be simple. A folder of files you understood, kept somewhere you controlled, doing exactly what you told them to. Somewhere along the way that got buried — under databases and dashboards, plugins and platforms, accounts that rent you back your own words.

**plain** is a small attempt to get it back.

<p style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;margin:2rem 0 0.75rem">
<a class="btn btn-primary btn-large" href="/admin/?demo=1">Try the editor →</a>
<a class="btn btn-quiet btn-large" href="https://github.com/plain-cms/plain">See the code</a>
</p>

*No account, no sign-up. The editor opens on a copy of this site inside your browser — write a post, publish it, open the history and restore an older version. Nothing you do there is saved anywhere.*

Your content is ordinary Markdown files in a Git repository. Your settings are one JSON file you can read in a minute. A build turns them into a fast, static website — nothing to keep running, nothing to patch, nothing that falls over at two in the morning.

## What that means in practice

- **You own everything.** Every page is a file in your repository. Move it, back it up, search it, keep it for twenty years.
- **It stays fast.** The published site is plain HTML and CSS. No JavaScript is required to read a single word of it.
- **Nothing to run.** No server, no database, no monthly bill for a box that mostly sits idle. It hosts anywhere static files live.
- **Edit how you like.** Write in your editor and commit, or use the browser admin — every save is just a commit, with full history and one-click restore.

## See it while you write

The browser admin is a Markdown editor with a live preview beside it — plus media uploads, drafts, full version history, and optional AI help for titles and tidying prose. Underneath, it is only ever writing commits, so everything stays in your repository.

![The plain admin — Markdown on the left, a live preview on the right, with optional AI assist.](/media/2026/07/admin-editor.svg)

Or skip it entirely and edit the files in your own editor. Both write to the same place; the files are always the source of truth.

**[Open the editor and try it](/admin/?demo=1)** — no account needed. It is the real admin, writing to a repository that lives in your browser tab.

## Boring on purpose

There is no clever framework here, no build that needs rewriting every year. plain does a small number of things and expects to still be doing them a decade from now. Boring is what survives.

[Try the editor](/admin/?demo=1) · [See the code](https://github.com/plain-cms/plain) · [Start your own site](https://github.com/plain-cms/plain/generate) · [Read the longer story](/about/)

---

*You are reading this on a plain site. This whole page is a Markdown file.*
