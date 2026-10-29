---
type: index
status: active
updated: 2026-10-29
---

# Agentes

Cada ficheiro define um agente: papel, âmbito, permissões. O frontmatter segue o formato de subagentes do Claude Code (`name`, `description`, `tools`), pelo que esta pasta pode ser usada diretamente como `.claude/agents/`.

| Agente | Papel | Escreve em |
|---|---|---|
| [[50-agents/orchestrator\|orchestrator]] | Curador do vault: delega, aplica propostas aprovadas, mantém índices | Índices, `99-archive/`, aplica aprovadas |
| [[50-agents/project-agent\|project-agent]] | Mantém o contexto de um projeto | `log/`, `INDEX.md`, ficheiros novos; o resto por proposta |
| [[50-agents/inbox-triage\|inbox-triage]] | Triagem do inbox | `00-inbox/`, `99-archive/`, propostas |
| [[50-agents/maintenance\|maintenance]] | Saúde do vault: links, duplicados, frontmatter | `90-system/reports/`, propostas |

## Ligar ao Claude Code
Na raiz do vault: `mkdir -p .claude && ln -s ../50-agents .claude/agents`
(o `INDEX.md` desta pasta é ignorado como agente por não ter `name` no frontmatter).
