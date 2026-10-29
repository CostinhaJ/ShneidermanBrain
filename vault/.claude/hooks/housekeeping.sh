#!/usr/bin/env bash
# Stop: (1) move para 99-archive/ os ficheiros com "status: archived"; (2) commit git.
# Corre sempre, sem depender de instruções ao agente. Nunca falha a sessão.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

grep -rlZE --include='*.md' '^status: archived[[:space:]]*$' . \
  --exclude-dir=.git --exclude-dir=.claude --exclude-dir=99-archive 2>/dev/null |
while IFS= read -r -d '' f; do
  rel="${f#./}"
  dest="99-archive/$rel"
  mkdir -p "$(dirname "$dest")"
  mv "$f" "$dest"
done

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
git add -A
git diff --cached --quiet && exit 0
git commit -qm "vault: snapshot $(date '+%Y-%m-%d %H:%M')" >/dev/null 2>&1
exit 0
