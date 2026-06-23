#!/bin/bash
# Prevents Claude from editing files while on master.
# Trigger as a PreToolUse hook on Edit|Write|MultiEdit.
# Exit code 2 => the stderr message is surfaced to Claude, which self-corrects (creates a branch).

branch=$(git branch --show-current 2>/dev/null)

if [ "$branch" = "master" ] || [ "$branch" = "main" ]; then
  echo "Editing on '$branch' is not allowed. Run /change to create a work branch first." >&2
  exit 2
fi

exit 0
