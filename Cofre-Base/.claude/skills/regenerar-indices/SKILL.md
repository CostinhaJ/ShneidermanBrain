---
name: regenerar-indices
description: Regenera os índices do cofre (Conhecido-vs-por-saber, Evolucao, Skills-e-Personas e os blocos AUTO dos domínios) e valida propriedades e links das notas. Usar depois de escrever ou alterar notas, e sempre ao fechar uma tarefa.
---
# Regenerar índices

Corre a partir da raiz do cofre (a pasta com `00-Mapa/`):

```bash
node .claude/skills/regenerar-indices/regen.mjs              # regenera e valida
node .claude/skills/regenerar-indices/regen.mjs --verificar  # só valida, não escreve
```

Não precisa de instalar nada (só Node).

## O que escreve
- `00-Mapa/Conhecido-vs-por-saber.md`: contagens por domínio e estado, e a lista de notas por estado.
- `00-Mapa/Evolucao.md`: objetivos e handoffs, os mais recentes primeiro.
- `00-Mapa/Skills-e-Personas.md`: o que existe em `.claude/` e nos rascunhos.
- `05-Fontes/Indice-de-fontes.md`: cada fonte por assunto, com `confirmado`, `publicar`, anexos e os anexos sem descrição.
- O bloco entre `<!-- AUTO:INICIO -->` e `<!-- AUTO:FIM -->` em cada nota de `1-Dominios/`.

Nunca edites estes ficheiros à mão: a alteração perde-se na próxima execução.

## O que valida
Propriedades obrigatórias por tipo, valores de `estado`, `verificado_por` quando `verificado`, `dominio` a apontar para um domínio real, tipo coerente com a pasta e links `[[...]]` partidos. Em `05-Fontes/`: a estrutura `<assunto>/<fonte>/<fonte>.md`, as propriedades da fonte, a tabela `## Anexos` (anexo listado que não existe, `Publicar` inválido, `Publicar: sim` numa fonte com `publicar: nao`), anexos sem linha na tabela e extensões na subpasta errada. Termina com código 1 se houver erros (linhas `ERRO`); os `AVISO` não bloqueiam.

## Como agir
- `falta a propriedade`: acrescenta-a à nota (ver `protocolo-conhecimento/propriedades.md`).
- `link partido`: cria a nota em falta ou corrige o nome. Não removas o link para calar o erro.
- `anexo sem linha na tabela`: se analisaste o ficheiro, acrescenta a linha com a descrição e `Publicar: nao`. Senão, reporta no handoff.
- Erro numa nota que não é tua: reporta no handoff, não corrijas.
