---
name: protocolo-conhecimento
description: Como ler e escrever conhecimento no cofre (funil de leitura, estados, propriedades, handoffs). Usar antes de ler notas do cofre ou de escrever qualquer nota em 03-Conhecimento, 05-Fontes ou 06-Registo.
---
# Protocolo de conhecimento

## Ler (funil: do geral para o específico)
1. `00-Mapa/Home.md`: o que é o projeto e em que estado está.
2. O teu brief em `01-Objetivos/`, se existir: ordem de leitura, skills e âmbito.
3. A nota de domínio relevante em `03-Conhecimento/1-Dominios/`. O bloco AUTO lista as notas do domínio, cada uma com o `resumo`.
4. Só as notas de `2-Conceitos/` cujo resumo interessa ao passo atual. Depois `3-Detalhe/`. No fim, `05-Fontes/` ou o código.
5. Antes de afirmar algo, vê o `estado`:
   - `verificado`: serve de base.
   - `proposto`: é hipótese, e dizes que é.
   - `obsoleto`: ignora e segue `substituido_por`.
   - `por-saber` (lacuna): não é um facto.

Não varras o cofre. Para procurar, usa `resumo` e `dominio`; não leias tudo.

## Escrever
1. Nota nova: `estado: proposto`, uma ideia, título afirmativo, `resumo` até 200 caracteres, `dominio` entre aspas, `fontes` preenchidas, `atualizado` com a data de hoje.
2. Nunca te dês `verificado` a ti próprio. Quem verifica é o `verificador`, um teste ou build, uma fonte primária ou o utilizador. Exceção: facto copiado de código existente, com `verificado_por: leitura-codigo` e o ficheiro em `fontes`.
3. Se contradisseres uma nota existente, não a apagues nem sobrescrevas. Escreve a tua como `proposto`, liga as duas e regista no handoff.
4. O que não conseguiste saber: nota em `Lacunas/` (template `lacuna`).
5. Um escritor por ficheiro. Não edites blocos AUTO nem os índices de `00-Mapa/` (a Home é só do orquestrador).
6. Fecha sempre com a skill `fechar-tarefa`.

## Onde está o quê
- Propriedades e valores permitidos: [propriedades.md](propriedades.md).
- Modelos de nota: `99-Sistema/Templates/`.
- Validação (a partir da raiz do cofre): `node .claude/skills/regenerar-indices/regen.mjs --verificar`.
