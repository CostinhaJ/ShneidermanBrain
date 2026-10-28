---
tipo: mapa
atualizado: AAAA-MM-DD
---
# Como usar este cofre

## Arranque (uma vez)
1. Descompacta a pasta onde quiseres.
2. Coloca o produto do projeto dentro de `07-Projeto/` (um repositório clonado, um manuscrito, uma pasta de trabalho). Se for texto que queres ver no Obsidian, remove `07-Projeto/` de "Ficheiros excluídos" nas definições.
3. No Obsidian: "Abrir pasta como cofre" e escolhe a pasta raiz (a que contém `CLAUDE.md`).
4. Num terminal **na raiz do cofre**, corre `claude` (ou `claude --agent orquestrador`). Não abras o Claude Code dentro de `07-Projeto`: perderias o `CLAUDE.md`, as personas e as regras.
5. Substitui `00-Mapa/Home.md` por uma Home do teu projeto (parte de `99-Sistema/Home-modelo.md`) e atualiza o `CLAUDE.md` raiz se precisares de regras próprias.

## Fluxo de trabalho
1. Põe as tuas fontes em `05-Fontes/` e diz ao orquestrador o objetivo. Ele cria o brief com `novo-objetivo`.
2. Os agentes delegados escrevem handoffs em `06-Registo/` e conhecimento `proposto` em `03-Conhecimento/`.
3. O `verificador` confirma, o `curador` consolida e `regenerar-indices` atualiza [[Conhecido-vs-por-saber]], [[Evolucao]] e [[Skills-e-Personas]].
4. Skills específicas do projeto: cria rascunhos em `99-Sistema/Skills-rascunho/` e promove com `/promover-skill`. Usa um prefixo por projeto (por exemplo, `livro-`) para as distinguir das genéricas.
5. Regras por pasta do produto: acrescenta ficheiros a `.claude/rules/` com `paths:` para as pastas do `07-Projeto/`.
