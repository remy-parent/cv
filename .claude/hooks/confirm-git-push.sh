#!/bin/bash
# PreToolUse hook on Bash. Forces a confirmation prompt before any `git push`,
# so the user always reviews the diff before code leaves the machine.
#
# Emits permissionDecision "ask" (not "deny") so a push is never silently blocked —
# it just always requires an explicit human OK. Matches `git push` anywhere in the
# command (incl. flags like `-u` / `--force-with-lease`); an occasional false prompt
# on a benign command is harmless, a missed push is not.

command=$(jq -r '.tool_input.command // ""')

if printf '%s' "$command" | grep -Eq '\bgit\b[^;&|]*\bpush\b'; then
  cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"Review the diff before any git push. Show what will go out (git diff / --stat) and wait for explicit approval."}}
JSON
fi

exit 0
