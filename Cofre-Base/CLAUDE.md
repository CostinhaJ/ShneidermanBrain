# Cofre de conhecimento e agentes

Esta pasta é, ao mesmo tempo, o cofre Obsidian e a raiz de trabalho do Claude Code.
O produto (código, manuscrito, etc.) vive em `07-Projeto/`. O conhecimento vive nas pastas numeradas.

## Antes de qualquer tarefa
1. Lê `00-Mapa/Home.md` (visão geral e estado).
2. Se há um brief em `01-Objetivos/`, segue-o: diz a persona, a ordem de leitura, as skills e o âmbito.
3. Para ler ou escrever conhecimento usa a skill `protocolo-conhecimento`.

## Regras que valem sempre
- Funil de leitura: Home → nota de domínio → notas ligadas → detalhe e fontes só se o passo o exigir. Não varras o cofre.
- Conhecimento novo entra com `estado: proposto`. Só passa a `verificado` por verificação externa (teste, build, fonte primária, utilizador). Nunca verifiques o que escreveste.
- Não inventes dados pessoais. Factos sobre o utilizador vêm só de `05-Fontes/` com `confirmado: sim`.
- Nada de `05-Fontes/` com `publicar: nao` entra em `07-Projeto/`.
- Não apagues conhecimento: marca `obsoleto` e liga ao substituto.
- Um escritor por ficheiro. Não edites blocos `AUTO` nem os índices gerados em `00-Mapa/`.
- Contratos (`Contrato-*` em `03-Conhecimento/3-Detalhe/` e o schema do código) só mudam por decisão explícita do utilizador.
- Ao terminar uma tarefa, usa a skill `fechar-tarefa`. O handoff é obrigatório.
- `git push`, apagar ficheiros e qualquer ação pública pedem confirmação do utilizador.

## Papéis
O orquestrador é a sessão principal (ou `claude --agent orquestrador`). Delega em `investigador`, `executor`, `verificador` e `curador` (`.claude/agents/`).
Os subagentes começam sem histórico: o pedido de delegação tem de incluir objetivo, âmbito, ordem de leitura e entregável.

## Pastas
| Pasta | Função |
|---|---|
| `00-Mapa/` | Visão geral, relações, estado (índices gerados) |
| `01-Objetivos/` | Um brief por objetivo (`OBJ-nnn`) |
| `03-Conhecimento/` | Domínios, conceitos, detalhe e lacunas |
| `05-Fontes/` | Material bruto e formulários do utilizador |
| `06-Registo/` | Um handoff por tarefa concluída |
| `07-Projeto/` | O repositório do produto |
| `99-Sistema/` | Templates e rascunhos de skills |
| `.claude/` | Personas (`agents/`), skills (`skills/`), regras por caminho (`rules/`) |

As regras específicas de cada zona carregam sozinhas quando trabalhas nela (`CLAUDE.md` da pasta ou `.claude/rules/`).
