---
name: novo-objetivo
description: Cria um brief de objetivo (OBJ-nnn) em 01-Objetivos com critério de sucesso verificável, ordem de leitura, skills, âmbito e fases. Usar quando o utilizador define um objetivo novo ou pede para planear trabalho antes de delegar.
argument-hint: "[descrição do objetivo]"
---
# Novo objetivo

1. **Percebe o objetivo.** Se o pedido for vago, faz no máximo duas perguntas ao utilizador. Se faltar o critério de sucesso, propõe um e pede confirmação.
2. **Critério verificável.** Cada ponto tem de poder ser provado por um comando, um teste, uma fonte ou o utilizador. Reescreve pontos como "ficar bom" ou "estar completo".
3. **Número.** Lista `01-Objetivos/` e usa o próximo `OBJ-nnn` (três dígitos). Nome do ficheiro: `OBJ-nnn-Slug-em-portugues.md`.
4. **Cria o brief** a partir de `99-Sistema/Templates/objetivo.md` e preenche todas as secções:
   - ordem de leitura (Home, domínio, contratos, fontes);
   - skills (lista as que existem em `.claude/skills/`; não inventes nomes);
   - âmbito: pode ler, pode escrever, fora de âmbito. Define sempre o que **não** se pode tocar;
   - fases, com a persona de cada uma (`investigador`, `executor`, `verificador`, `curador`) e o que corre em paralelo;
   - entregáveis.
5. **Paralelismo.** Só marca tarefas como paralelas se escreverem em ficheiros diferentes. Tarefas que partilham um ficheiro, ou um comando com efeitos partilhados (build, instalação), são sequenciais.
6. **Confirma com o utilizador** o critério e o âmbito antes de delegar. Depois liga o objetivo na Home ("Objetivos em curso") e corre `regenerar-indices`.
