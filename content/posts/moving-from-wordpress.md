---
title: Moving from WordPress takes one command
date: 2026-11-10
description: plain now imports a whole WordPress site — posts, pages, images, menu and comments — and redirects every old address, so nothing you have published goes missing.
tags:
  - notes
---

A lot of people who would like a quieter website are already running one. It's usually WordPress, it's usually years old, and it's usually the reason they haven't moved: hundreds of posts, a media library nobody wants to sort through again, and links all over the web pointing at addresses that have to keep working.

So plain now has a WordPress importer. It does the whole move for you.

## Three steps

1. In your WordPress dashboard, go to **Tools → Export**, choose **All content**, and download the file. It's one `.xml` file.
2. In your plain repository, run:

   ```sh
   node tools/migrate/wordpress.js ~/Downloads/yoursite.WordPress.xml
   ```

3. Copy the result into your site and build:

   ```sh
   cp -R plain-import/content/. content/
   cp -R plain-import/media/. media/
   cp plain-import/data/redirects.json data/redirects.json
   node build.js
   ```

That's the move. Your old site can stay up while you look things over. Nothing is written into your repository until you copy it there yourself.

## Then sign in and keep writing

Your admin lives at `/admin/` on your new site. There's no account to create. You give it permission to save to your GitHub repository, in one of two ways:

- **Paste a token.** On GitHub go to **Settings → Developer settings → Fine-grained tokens → Generate new token**. Give it access to only your site's repository, with **Contents: Read and write** (plus **Actions: Read-only** if you want to see build status). Copy it and paste it into `/admin/`. It stays in your browser and is only ever sent to GitHub.
- **Add a "Sign in with GitHub" button.** Deploy the small free Cloudflare Worker that comes with plain, and every writer signs in with one click instead.

Both are explained step by step in [Signing in to Plain: a pasted token, or one click with GitHub](https://victorantos.com/posts/two-ways-to-sign-in-to-your-plain-admin/).

## What comes across

- **Posts and pages**, as Markdown files you can read: posts at `/blog/your-post/`, pages at `/your-page/`. A static front page becomes your home page.
- **The writing itself**, whether it came from the block editor or the classic one: headings, lists, quotes, code, tables, captions, galleries and footnotes. Video embeds become plain links.
- **Your images.** Every image your posts use is downloaded into `media/`, sorted by year and month the same way WordPress did it. If the old site is already offline, point the importer at the `wp-content/uploads` folder from a backup.
- **Categories and tags**, featured images and SEO descriptions.
- **Your main menu**, and an archive of your approved comments, with names and websites but never e-mail addresses.
- **Every old address.** Each post, page, category, tag, date archive and the feed gets a redirect to its new home, so search rankings and links people shared years ago keep working.

Drafts, private and scheduled posts arrive as drafts, each with a note saying why. Anything the importer couldn't convert with confidence ends up in a short report: a page built with a page builder, a link to something that no longer exists, an image the old server wouldn't hand over. Nothing is dropped without a mention.

## What doesn't come along

plain has no database and no server. That is the point: it's why your site will be fast, free to host and never in need of patching. But it means the parts of WordPress that run code every time someone visits don't move as they are. That covers shops, memberships and logins, live comment forms, and page-builder layouts. With a page builder the words come across but the layout doesn't. Revisions, widgets and theme settings stay behind too.

If you do need something live, a contact form or new comments for example, you don't need to bring a server into your site. Open **Backend** in the admin, paste the address of a small API (or create one from the template), and plugins such as the contact form send their data there. Your site stays a folder of files.

## Try it

The full guide, with every option and a checklist for switching over, is in the [migration guide](https://github.com/plain-cms/plain/blob/main/tools/migrate/README.md). If you'd like to see what you're moving to first, [open the editor](/admin/?demo=1). It runs in your browser, no account needed.
