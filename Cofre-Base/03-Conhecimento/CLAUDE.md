# 03-Conhecimento

Níveis de abstração: `1-Dominios` (visão geral) → `2-Conceitos` (notas atómicas) → `3-Detalhe` (tabelas, contratos, evidência). `Lacunas` guarda o que ainda não se sabe.

- Uma ideia por nota. Título em forma de afirmação (por exemplo, "Projetos são ficheiros md validados por schema").
- Usa o template de `99-Sistema/Templates/`. Obrigatórios: `tipo`, `dominio` (entre aspas, `"[[Dominio-X]]"`), `estado`, `resumo` (uma linha, até 200 caracteres), `atualizado`.
- Estado inicial: `proposto`. Para `verificado` exige `verificado_por` (`leitura-codigo`, `teste`, `build`, `fonte-primaria`, `utilizador` ou `verificador`) e `fontes` com o ficheiro ou link que prova.
- `fontes`: caminhos de ficheiros (por exemplo, `07-Projeto/src/content.config.ts`) ou notas `[[...]]`.
- Não edites o bloco `AUTO` nas notas de domínio. Quem o mantém é `regenerar-indices`.
- Um procedimento repetível não é conhecimento: vai para `99-Sistema/Skills-rascunho/`.
- Obsoleto: muda o `estado` e acrescenta `substituido_por: "[[...]]"`. Nunca apagues.
- O que não se sabe vira nota em `Lacunas` (`estado: por-saber`). Quando se resolver, cria a nota de conhecimento e marca a lacuna como `obsoleto`.
