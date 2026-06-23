---
description: Finalize the current branch (lint, test, rebase on master, push, open the PR)
argument-hint: [PR title] (optional)
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git stash list:*), Bash(git fetch:*), Bash(git rebase:*), Bash(git push:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(npm run lint:*), Bash(npm run test:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh pr list:*)
---

Goal: take the current branch all the way to an open PR, cleanly.

Steps in order. **If a step fails, STOP**, show me the error, do not continue.

1. **Branch guard**: `git branch --show-current`. If we're on `master`, refuse and stop.

2. **Open PRs overview**: `gh pr list --state open --base master`. Tell me how many PRs are
   currently open and awaiting merge, and list them (number, title, branch). This is just an
   FYI so I see what's already in flight before adding another — do not block on it.

3. **Stash reminder**: `git stash list`. If there are pending stashes, list them and
   warn me — `/change` may have created one I forgot. Ask whether I want to reapply them
   (`git stash pop`) before continuing, or ignore them. Wait for my answer.

4. **Uncommitted changes**: `git status --porcelain`. If there are any, ask whether I want
   to commit them (propose a Conventional Commits message based on the diff) or stop here.

5. **Lint**: `npm run lint`. On failure → stop, show the errors.

6. **Tests**: `npm run test`. On failure → stop, show the failing tests.
   (Prettier is NOT re-run here: the pre-commit hook already applied it at commit time.)

7. **Sync master**: `git fetch origin`. Compare the branch to `origin/master`.

- If `origin/master` has moved ahead, run `git rebase origin/master`.
- On conflict: stop, list the conflicting files, ask me to resolve them.
  After resolution, do NOT re-run lint/test on your own — tell me to run `/submit` again.

8. **Push**: `git push --force-with-lease -u origin <current-branch>`.
   (`--force-with-lease` because a rebase rewrites history; never plain `--force`.)

9. **PR**: check whether a PR already exists (`gh pr view`). If not, create it:
   `gh pr create --base master --fill`

- If I passed a title as an argument, use it; otherwise let `--fill` infer it from the commits.
- The body should summarize the changes + tick: lint OK, tests OK.

10. **Confirm**: show the PR URL. Remind me the rest is manual
    (GitHub CI, code review, Vercel preview check) before merge.

NEVER merge yourself. The merge happens via GitHub once CI is green + review is OK.
