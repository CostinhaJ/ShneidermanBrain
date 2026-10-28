---
name: fechar-tarefa
description: Fecha uma tarefa: escreve o handoff em 06-Registo, regista conhecimento novo e lacunas, propõe skills e valida o cofre. Usar no fim de qualquer tarefa de um agente, sempre.
---
# Fechar tarefa

1. **Handoff.** Cria `06-Registo/AAAA-MM-DD-OBJ-nnn-slug.md` a partir de `99-Sistema/Templates/handoff.md`.
   - `estado: concluido` só se o critério do brief foi cumprido **e** provado. Senão `parcial` ou `bloqueado`, com a razão.
   - Conteúdo: o que fizeste; ficheiros alterados; como verificaste (comando e resultado); o que falta; decisões que precisam do utilizador; onde podes ter errado.
2. **Conhecimento novo.** Notas `proposto` segundo o protocolo. Atualiza `atualizado` nas que alteraste.
3. **Lacunas.** O que descobriste que não sabes vira nota em `03-Conhecimento/Lacunas/`.
4. **Skills candidatas.** Se repetiste uma sequência de passos pelo menos duas vezes, ou o brief previa um procedimento reutilizável, escreve um rascunho em `99-Sistema/Skills-rascunho/<nome>/SKILL.md`. Não o actives (quem promove é o utilizador, com `promover-skill`).
5. **Valida.** A partir da raiz do cofre: `node .claude/skills/regenerar-indices/regen.mjs`. Corrige os erros que forem das tuas notas; os dos outros, só reporta.
6. **Responde** a quem te chamou em até 5 linhas: estado, caminho do handoff e o que precisa de decisão.
