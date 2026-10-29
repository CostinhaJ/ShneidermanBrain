---
paths:
  - "40-skills/**"
  - "50-agents/**"
---

# Regras de skills e agentes

## Skills (`40-skills/<nome>/SKILL.md`)
- Frontmatter com `name` e `description`. A `description` diz quando usar a skill, numa frase.
- Uma skill, um procedimento, em passos numerados.
- Termina com uma verificação que se pode confirmar (o que tem de ser verdade no fim).
- Procedimento de vários passos vive aqui, nunca em `CLAUDE.md`.

## Agentes (`50-agents/<nome>.md`)
- Frontmatter com `name`, `description` e `tools`.
- `tools` lista só o necessário. Nenhum agente tem `Bash`: o shell contornaria os hooks.
- Descreve o âmbito de escrita em termos de pastas, coerente com a secção "Escrita" do `CLAUDE.md`.
- O que tem de acontecer sempre (commit, arquivo) é feito por hook, nunca por instrução ao agente.
