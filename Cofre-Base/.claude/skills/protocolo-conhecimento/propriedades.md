# Propriedades das notas

Escreve os valores com aspas quando contêm `[[ ]]` (YAML). Datas em `AAAA-MM-DD`.

| Propriedade | Valores | Quando |
|---|---|---|
| `tipo` | `dominio`, `conceito`, `detalhe`, `lacuna`, `fonte`, `objetivo`, `handoff` | sempre |
| `dominio` | `"[[Dominio-X]]"` | conceito, detalhe, lacuna, objetivo |
| `estado` (conhecimento) | `por-saber`, `proposto`, `verificado`, `obsoleto` | domínio, conceito, detalhe, lacuna |
| `estado` (objetivo) | `aberto`, `em-curso`, `concluido` | objetivo |
| `estado` (handoff) | `concluido`, `parcial`, `bloqueado` | handoff |
| `confianca` | `baixa`, `media`, `alta` | recomendado |
| `resumo` | uma linha, até 200 caracteres | sempre (é o que os agentes leem primeiro; nas fontes alimenta o `Indice-de-fontes`) |
| `fontes` | lista de caminhos ou `"[[nota]]"` | conceito, detalhe |
| `verificado_por` | `leitura-codigo`, `teste`, `build`, `fonte-primaria`, `utilizador`, `verificador` | obrigatório se `estado: verificado` |
| `substituido_por` | `"[[nota]]"` | obsoleto |
| `atualizado` | data | sempre |
| `confirmado` | `sim`, `nao` | fontes do utilizador |
| `publicar` | `sim`, `nao`, `parcial` | fontes do utilizador |

Só o utilizador altera `confirmado` e `publicar`.

Fontes: cada uma é a pasta `05-Fontes/<assunto>/<fonte>/` com a nota `<fonte>.md`. Os anexos ficam em `imagens/`, `videos/`, `audio/` ou `documentos/` e têm uma linha na tabela `## Anexos` (ficheiro, descrição, `Publicar` `sim` ou `nao`).

Handoff: `objetivo` (por exemplo, `OBJ-001`) e `estado` obrigatórios. Objetivo: `id` e `persona` obrigatórios.

Regra de ouro: `resumo` diz o que a nota afirma, não o que ela é. "O build falha se o schema estiver errado" é um bom resumo; "Notas sobre o schema" não é.
