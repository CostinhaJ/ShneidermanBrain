# Vault de contexto para agentes

Vault Obsidian usado como armazém de contexto e skills de agentes, desenvolvido por orquestração.

## Requisitos
`git`, `python3` e Claude Code.

## Arranque
1. Copia esta pasta para o Obsidian (ou abre-a como vault novo).
2. `git init` e primeiro commit. Sem git, o hook de fim de sessão não faz commit.
3. `mkdir -p .claude && ln -s ../50-agents .claude/agents` (a pasta `.claude/` já existe com hooks e regras).
4. Corre o Claude Code na raiz do vault e confirma com `/memory` que o `CLAUDE.md` e as regras carregaram.
5. Pede: "Usa o agente orchestrator para criar o projeto <nome>".
6. Aprova propostas em `90-system/review/` mudando `status: pending` para `approved`.

## Como é imposto (não só pedido)
| Ficheiro | O que faz |
|---|---|
| `.claude/settings.json` | Nega `rm`, `git push`, `git reset --hard`, `git clean`; regista os hooks |
| `.claude/hooks/guard-write.py` | Antes de Edit/Write: bloqueia escritas fora das zonas livres sem proposta aprovada; impede agentes de escrever `status: approved` |
| `.claude/hooks/housekeeping.sh` | No fim da sessão: move ficheiros `status: archived` para `99-archive/` e faz commit |
| `.claude/rules/*.md` | Regras que só carregam ao trabalhar nas pastas respetivas |

Os agentes não têm `Bash`, para que o shell não contorne os hooks. As regras em `CLAUDE.md` são contexto; os hooks são o que garante o cumprimento.
