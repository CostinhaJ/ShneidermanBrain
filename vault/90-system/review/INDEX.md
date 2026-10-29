---
type: index
status: active
updated: 2026-10-29
---

# Fila de revisão

Alterações a ficheiros estáveis (`CONTEXT.md`, specs, skills, agentes, `CLAUDE.md`) são propostas aqui e só aplicadas após aprovação humana.

## Formato de proposta
Ficheiro `AAAA-MM-DD-<agente>-<assunto>.md`:

```yaml
---
type: proposal
target: <caminho do ficheiro a alterar>
status: pending   # pending | approved | rejected
updated: AAAA-MM-DD
owner-agent: <agente que propõe>
---
```
Corpo: motivo da alteração + o diff ou o texto completo proposto.

## Fluxo
1. O agente cria a proposta com `status: pending`.
2. Tu revês: mudas para `approved` ou `rejected`.
3. O orquestrador aplica as aprovadas, regista no `log/` e arquiva a proposta em `99-archive/`.

## Pendentes
Nenhuma.
