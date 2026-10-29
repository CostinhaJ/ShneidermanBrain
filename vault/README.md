# Vault de contexto para agentes

Estrutura para um vault Obsidian usado como armazém de contexto e skills de agentes, com desenvolvimento gerido por orquestração.

## Arranque rápido
1. Copia esta pasta para o teu Obsidian (ou abre-a como vault novo).
2. `git init` na raiz e faz o primeiro commit.
3. Liga os agentes ao Claude Code: `mkdir -p .claude && ln -s ../50-agents .claude/agents`
4. Corre o Claude Code na raiz do vault e pede: "Usa o agente orchestrator para criar o projeto <nome>" (ou "faz a triagem do inbox").
5. Revê `90-system/review/` regularmente: nada de estável muda sem a tua aprovação.

## Ideias para a fase seguinte
- Agendar o orquestrador (diário) com uma tarefa agendada ou cron.
- Adicionar um agente por área/projeto quando o volume justificar.
- Hooks do Claude Code para impor permissões de escrita por pasta, em vez de depender só das instruções.

Regras completas em `CLAUDE.md`; mapa em `INDEX.md`.
