---
description: Start a work branch from an up-to-date master, handling any uncommitted changes
argument-hint: <type>/<description> (e.g. feat/cv-chat-widget)
allowed-tools: Bash(git status:*), Bash(git fetch:*), Bash(git stash:*), Bash(git checkout:*), Bash(git branch:*), Bash(git add:*), Bash(git commit:*)
---

Goal: create branch `$1` from an up-to-date `origin/master`.

Follow these steps in order, without skipping any:

1. If `$1` is empty, ask me for the name (Conventional Commits format: `feat/`, `fix/`, `chore/`...) and wait.

2. Check the current branch: `git branch --show-current`.

3. Detect uncommitted changes: `git status --porcelain`.

4. **If there are uncommitted changes**, do NOT create the branch. Show the detailed `git status`
   and ask me how to handle them. Offer:
   - **Carry over**: the changes follow onto the new branch (`checkout -b` keeps them).
     Prefer this if those changes ARE the start of this work.
   - **Stash**: `git stash push -u`, then create a clean branch.
   - **Commit first**: commit them on the current branch before branching.
   - **Cancel**.
     Wait for my answer before acting.

5. **If the tree is clean** (or once step 4 is resolved):
   - `git fetch origin`
   - `git checkout -b $1 origin/master`

6. Confirm: new branch name + base (`origin/master` + short HEAD commit).

Rules:

- Do not push anything, do not create a PR: this command stops at local branch creation.
- After this I'll write the code myself. When I'm done, I'll run `/submit`.
