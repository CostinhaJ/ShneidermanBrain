---
type: schema
status: active
updated: 2026-10-29
---

# Schema de frontmatter

Todos os ficheiros `.md` começam com:

```yaml
---
type: index | context | decision | spec | log | knowledge | skill | agent | proposal | report | schema
project: <nome>          # obrigatório em ficheiros de projeto
status: draft | active | stable | archived   # decisões: proposed | accepted | superseded
updated: AAAA-MM-DD
owner-agent: <nome do agente responsável>
tags: []                 # opcional
---
```

## Regras
- `updated` é obrigatório e atualizado em cada alteração.
- `owner-agent` identifica quem pode propor alterações sem revisão adicional (ver `50-agents/`).
- Valores fora desta lista contam como erro para o agente de manutenção.
- `status: archived` retira o ficheiro: no fim da sessão o hook move-o para `99-archive/`, mantendo o caminho de origem.
- `status: approved` em propostas só é escrito por humanos.

## Nomes de ficheiros
- `kebab-case`, sem acentos, sem espaços.
- Decisões: `NNNN-titulo-curto.md` (numeração sequencial por projeto).
- Logs: uma entrada por sessão, dentro de `log/AAAA-MM.md` (um ficheiro por mês).
