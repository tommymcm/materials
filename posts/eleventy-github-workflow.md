---
layout: layouts/post.njk
title: Deploying Eleventy site with GitHub Actions
date: 2025-12-17
published: true
desc: A brief explanation of how I publish my Eleventy website using github actions.
tags:
  - posts
  - webdev
  - eleventy
  - github
---

I recently moved my website from hand-written HTML over to [Eleventy](https://www.11ty.dev/).
It's been really nice to work with, the transition process is smooth, and their template system is intuitive.
I'm now able to generate all of my web content from a single source of JSON files!
<label for="sn-1" class="sidenote-toggle sidenote-number"></label>
<input type="checkbox" id="sn-1" class="sidenote-toggle" />
<span class="sidenote">You can find the source code [here](https://www.github.com/tommymcm/materials).</span>

After finishing up my port, I was interested in automate the process of publishing changes, which is what this post is about.
I originally did this work with two repos because I wanted to have the materials (unpublished papers, course materials, etc.) not be public.
Since then, I moved over to a public repo to avoid hitting any GitHub Action limits<label for="sn-2" class="sidenote-toggle sidenote-number"></label>
<input type="checkbox" id="sn-2" class="sidenote-toggle" />
<span class="sidenote">I am a penny pincher.</span>
and use a private fork to hold uinpublished items.

Here's the step-by-step process that I took:

### 1. Create a Personal Access Token (PAT)
First, you need to create a token that allows the private repo to push to your GitHub Pages repo:
 - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
 - Click "Generate new token (classic)"
 - Give it a name like "Eleventy Deploy"
 - Select the repo scope (this gives full control of private repositories)
 - Generate and copy the token (you won't see it again!)

### 2. Add the Token to Your Private Repo
 - Go to your private repo's Settings → Secrets and variables → Actions
 - Click "New repository secret"
 - Name it PAGES_DEPLOY_TOKEN
 - Paste your personal access token
 - Save it

## 3. Create the GitHub Action Workflow
In your private repo, create .github/workflows/deploy.yml:

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # or whatever your default branch is

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout private repo
        uses: actions/checkout@v4
      
      - name: Setup bun
        uses: oven-sh/setup-bun@v2

      # bun is fun! if you disagree, you can use node:
      # - name: Setup Node.js  
      #   uses: actions/setup-node@v4
      #   with:
      #     node-version: '20'  # or your preferred version
      #     cache: 'npm'
      
      - name: Install dependencies
        run: bun install
      
      - name: Build Eleventy site
        run: bun run eleventy
      
      - name: Deploy to GitHub Pages repo
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.PAGES_DEPLOY_TOKEN }}
          external_repository: you/you.github.io  # TODO: your pages repo
          publish_branch: main  # or gh-pages, depending on your setup
          publish_dir: ./_site  # Eleventy's default output directory
          cname: yourdomain.com  # TODO: custom domain (optional)
```

### 4. Configure Your GitHub Pages Repo
Make sure your GitHub Pages repository is set to publish from the branch you specified (usually `main` or `gh-pages`) in the repository settings.

That's it! Now when you push to your repo, it will automatically build your Eleventy site and deploy it to your GitHub Pages repo.
