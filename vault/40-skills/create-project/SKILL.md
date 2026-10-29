---
name: create-project
description: Cria um projeto ou subprojeto novo no vault a partir do template, com índice, contexto e registos. Usar quando surge um projeto que ainda não tem pasta em 10-projects/.
---

# Criar projeto

## Passos
1. Confirma que o projeto não existe já (lê `10-projects/INDEX.md`). Se existir, usa-o.
2. Decide a posição: raiz de `10-projects/` ou dentro de um projeto-pai (subprojeto).
3. Lê os ficheiros de `10-projects/_template/` como modelo.
4. Cria cada ficheiro novo com Write em `10-projects/[<pai>/]<nome-kebab-case>/`, já preenchido: `INDEX.md` (resumo, estado, próximas ações) e `CONTEXT.md` (objetivo, âmbito, stakeholders, restrições). O que não sabes fica como `TODO:` explícito; não inventes. Não copies e depois edites: editar um ficheiro existente de projeto exige proposta.
5. Frontmatter completo e sem placeholders (`<nome-do-projeto>`, `AAAA-MM-DD`).
6. Cria também `log/INDEX.md` e `log/AAAA-MM.md` com a primeira entrada ("Projeto criado"), e `decisions/` e `specs/` só quando houver conteúdo.
7. Atualiza o `INDEX.md` da pasta-mãe e `INDEX.md` da raiz (projetos ativos).
8. Se o projeto precisa de um agente próprio, propõe-o via [[40-skills/propose-change/SKILL]] (nunca cries ficheiros em `50-agents/` diretamente).

## Verificação
- Todos os ficheiros têm frontmatter válido.
- Nenhum placeholder `<...>` ou `AAAA-MM-DD` ficou por substituir.
- Os índices acima foram atualizados.
