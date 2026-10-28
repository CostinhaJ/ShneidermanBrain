---
tipo: indice
gerado: true
atualizado: 2026-10-28
---
# Skills e personas

> Gerado por `regenerar-indices`. Os ficheiros reais vivem em `.claude/` (pasta oculta no Obsidian).

## Personas (`.claude/agents/`)

| Nome | Descrição |
|---|---|
| `curador` | Mantém o cofre coerente depois de várias tarefas — consolida handoffs, resolve duplicados e contradições, marca notas obsoletas, regenera os índices e propõe skills a ... |
| `executor` | Implementa uma tarefa concreta dentro do âmbito do brief, alterando ficheiros do projeto em `07-Projeto/` e usando as skills indicadas. Usar para escrever ou editar o ... |
| `investigador` | Pesquisa e documenta. Lê fontes (ficheiros, código, web) e escreve conhecimento novo como `proposto`, mais as lacunas que encontrar. Não altera o código nem o `07-Proj... |
| `orquestrador` | Coordena o trabalho do cofre. Lê o mapa, cria e acompanha objetivos, delega nos outros agentes e integra os resultados. Usar como sessão principal com `claude --agent ... |
| `verificador` | Verifica de forma independente o trabalho dos outros agentes contra o critério de sucesso do brief (build, testes, fontes) e decide se as notas passam a `verificado`. ... |

## Skills ativas (`.claude/skills/`)

| Nome | Descrição |
|---|---|
| `fechar-tarefa` | Fecha uma tarefa: escreve o handoff em 06-Registo, regista conhecimento novo e lacunas, propõe skills e valida o cofre. Usar no fim de qualquer tarefa de um agente, se... |
| `novo-objetivo` | Cria um brief de objetivo (OBJ-nnn) em 01-Objetivos com critério de sucesso verificável, ordem de leitura, skills, âmbito e fases. Usar quando o utilizador define um o... |
| `promover-skill` | Promove um rascunho de skill de 99-Sistema/Skills-rascunho para .claude/skills depois de o validar. Só o utilizador a invoca, com /promover-skill nome-do-rascunho. |
| `protocolo-conhecimento` | Como ler e escrever conhecimento no cofre (funil de leitura, estados, propriedades, handoffs). Usar antes de ler notas do cofre ou de escrever qualquer nota em 03-Conh... |
| `regenerar-indices` | Regenera os índices do cofre (Conhecido-vs-por-saber, Evolucao, Skills-e-Personas e os blocos AUTO dos domínios) e valida propriedades e links das notas. Usar depois d... |

## Rascunhos de skills (`99-Sistema/Skills-rascunho/`)

_Nenhuma._
