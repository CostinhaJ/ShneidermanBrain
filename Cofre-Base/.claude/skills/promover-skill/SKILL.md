---
name: promover-skill
description: Promove um rascunho de skill de 99-Sistema/Skills-rascunho para .claude/skills depois de o validar. Só o utilizador a invoca, com /promover-skill nome-do-rascunho.
disable-model-invocation: true
argument-hint: "[nome-do-rascunho]"
---
# Promover skill

Uma skill ativa muda o comportamento de todos os agentes futuros, por isso passa por uma verificação e pela tua confirmação.

1. Lê `99-Sistema/Skills-rascunho/$ARGUMENTS/SKILL.md`. Se não existir, lista os rascunhos disponíveis.
2. Valida e mostra o resultado ao utilizador:
   - foi usada com sucesso em pelo menos um handoff `concluido` (cita qual);
   - o `description` diz o que faz e **quando** usar, em menos de 1500 caracteres;
   - o corpo tem menos de 500 linhas; o detalhe vai para ficheiros ao lado;
   - não contém dados pessoais nem segredos;
   - não duplica uma skill existente em `.claude/skills/` (se duplica, propõe fundir).
3. Pede confirmação explícita.
4. Se confirmado: move a pasta para `.claude/skills/$ARGUMENTS/` e corre `regenerar-indices`.
5. Diz ao utilizador que, se a skill não aparecer na sessão em curso, deve correr `/reload-skills`.
