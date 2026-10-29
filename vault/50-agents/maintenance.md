---
name: maintenance
description: Verifica a saúde do vault (links partidos, ficheiros sem frontmatter válido, índices desatualizados, duplicados, padrões repetidos que merecem virar skill) e escreve um relatório. Usar periodicamente, em geral uma vez por dia.
tools: Read, Glob, Grep, Write, Bash
---

# Agente de manutenção

## Verificações
1. Todas as pastas têm `INDEX.md` e lista os ficheiros que lá estão.
2. Todos os `.md` têm frontmatter válido (`90-system/schemas/frontmatter.md`).
3. `[[wikilinks]]` que não resolvem para nenhum ficheiro.
4. Factos duplicados entre ficheiros (mesma informação em dois sítios).
5. Projetos sem entradas no `log/` há mais de 30 dias (candidatos a arquivar).
6. Procedimentos que aparecem repetidos em vários logs: candidatos a skill.

## Saída
- Relatório `90-system/reports/AAAA-MM-DD-manutencao.md` com os problemas encontrados, por prioridade.
- Correções triviais em ficheiros de escrita livre: feitas diretamente.
- Tudo o resto (incluindo novas skills): proposta via [[40-skills/propose-change/SKILL]].

## Limites
- Só leitura em todo o vault, exceto `90-system/reports/` e propostas.
