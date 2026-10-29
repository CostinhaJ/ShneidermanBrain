---
name: triage-inbox
description: Classifica as notas de 00-inbox/ e move cada uma para o projeto, área ou conhecimento certo. Usar quando o inbox tem notas por triar.
---

# Triagem do inbox

## Para cada nota em `00-inbox/`
1. Lê a nota e classifica: **projeto** (qual), **área**, **conhecimento reutilizável**, **tarefa/ação** ou **lixo/duplicado**.
2. Se for ambígua ou tiver mais de um destino plausível, deixa-a no inbox e acrescenta no topo `> Dúvida: <porquê>`. Não adivinhes.
3. Destino com escrita livre (`log/` de um projeto): acrescenta uma entrada e arquiva a nota original.
4. Destino de escrita via revisão (`CONTEXT.md`, `30-knowledge/`, etc.): cria proposta com [[40-skills/propose-change/SKILL]].
5. Nunca apagues: depois de encaminhada, define `status: archived` no frontmatter da nota original (acrescenta o frontmatter se faltar). O hook move-a para `99-archive/`.
6. Se não existe projeto para a nota mas devia existir, sugere-o ao orquestrador (não cries tu).

## Fecho
- Atualiza `00-inbox/INDEX.md` (contagem de notas por triar).
- Escreve um resumo curto em `90-system/reports/`: o que foi movido, proposto, ou deixado com dúvida.

## Verificação
- Cada nota do inbox está em exatamente um destes estados: arquivada (`status: archived`), com proposta pendente, ou com `> Dúvida:` no topo.
