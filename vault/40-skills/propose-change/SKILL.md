---
name: propose-change
description: Propõe uma alteração a um ficheiro de escrita via revisão (CONTEXT, specs, decisões, skills, agentes, CLAUDE.md) sem o modificar diretamente. Usar sempre que a alteração cai fora das zonas de escrita livre.
---

# Propor alteração

1. Lê o ficheiro alvo e confirma que a alteração é necessária e não duplica algo existente.
2. Cria `90-system/review/AAAA-MM-DD-<agente>-<assunto>.md` com o frontmatter definido em `90-system/review/INDEX.md` (`status: pending`).
3. No corpo: **Motivo** (2–3 linhas) e **Alteração** (diff ou texto completo proposto).
4. Acrescenta a proposta à lista de pendentes em `90-system/review/INDEX.md`.
5. Não apliques a alteração. Só o orquestrador aplica, e só depois de `status: approved`.
