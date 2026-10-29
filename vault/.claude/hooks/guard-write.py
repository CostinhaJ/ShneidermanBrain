#!/usr/bin/env python3
"""PreToolUse (Edit|Write): impõe as regras da secção "Escrita" do CLAUDE.md.

Mantém este ficheiro e essa secção coerentes. Bloqueio = exit 2 + mensagem em stderr.
"""
import json
import os
import re
import sys

FREE_PREFIXES = ("00-inbox/", "99-archive/", "90-system/reports/", "90-system/review/")
APPROVED_RE = re.compile(r"status:\s*[\"']?approved", re.IGNORECASE)


def block(msg):
    print(f"BLOQUEADO: {msg}", file=sys.stderr)
    sys.exit(2)


def approved_targets(root):
    """Alvos de propostas com status: approved em 90-system/review/."""
    targets = set()
    review = os.path.join(root, "90-system", "review")
    if not os.path.isdir(review):
        return targets
    for name in os.listdir(review):
        if not name.endswith(".md") or name == "INDEX.md":
            continue
        try:
            with open(os.path.join(review, name), encoding="utf-8") as f:
                head = [next(f, "") for _ in range(20)]
        except OSError:
            continue
        status = target = None
        for line in head:
            m = re.match(r"status:\s*(\S+)", line)
            if m and status is None:
                status = m.group(1).strip("\"'")
            m = re.match(r"target:\s*(\S+)", line)
            if m and target is None:
                target = m.group(1).strip("\"'")
        if status == "approved" and target:
            targets.add(os.path.normpath(target))
    return targets


def is_free(rel, exists):
    parts = rel.split("/")
    if rel.startswith(FREE_PREFIXES):
        return True
    if parts[-1] == "INDEX.md":
        return True
    if rel.startswith("10-projects/"):
        if "log" in parts[:-1]:
            return True
        if not exists:
            return True
    return False


def main():
    data = json.load(sys.stdin)
    tool_input = data.get("tool_input", {})
    path = tool_input.get("file_path")
    if not path:
        sys.exit(0)

    root = os.path.realpath(os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd") or os.getcwd())
    if not os.path.isabs(path):
        path = os.path.join(data.get("cwd") or root, path)
    real = os.path.realpath(path)
    if real != root and not real.startswith(root + os.sep):
        sys.exit(0)  # fora do vault: não é connosco

    rel = os.path.relpath(real, root).replace(os.sep, "/")

    # Nenhum agente aprova propostas.
    if rel.startswith("90-system/review/"):
        content = tool_input.get("content") or tool_input.get("new_string") or ""
        if APPROVED_RE.search(content):
            block("só o humano pode definir status: approved numa proposta.")
        sys.exit(0)

    if is_free(rel, os.path.exists(real)):
        sys.exit(0)

    if os.path.normpath(rel) in approved_targets(root):
        sys.exit(0)

    block(
        f"'{rel}' só muda com uma proposta aprovada. "
        "Cria uma proposta em 90-system/review/ (skill propose-change) e espera aprovação."
    )


if __name__ == "__main__":
    main()
