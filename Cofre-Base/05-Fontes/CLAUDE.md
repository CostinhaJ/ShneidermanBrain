# 05-Fontes

Material bruto e formulários do utilizador. É a **única** origem aceite para factos sobre a pessoa.

## Por onde começar
Lê primeiro `Indice-de-fontes.md` (gerado por `regenerar-indices`). Lista cada fonte com `confirmado`, `publicar`, `resumo` e anexos. Abre só as fontes de que o passo atual precisa.

## Estrutura (assunto, depois fonte, depois tipo)
```
05-Fontes/<assunto>/<fonte>/<fonte>.md
05-Fontes/<assunto>/<fonte>/imagens/      (png, jpg, jpeg, gif, webp, svg)
05-Fontes/<assunto>/<fonte>/videos/       (mp4, mov, webm, mkv)
05-Fontes/<assunto>/<fonte>/audio/        (mp3, wav, m4a, ogg)
05-Fontes/<assunto>/<fonte>/documentos/   (pdf, docx, xlsx, csv, txt, md, ...)
```
- `<assunto>` agrupa por tema do projeto (por exemplo `pessoal/`, `projetos/`, `capitulos/`, `entrevistas/`). Nunca por tipo de ficheiro.
- Cada fonte é uma pasta. A nota principal tem **o mesmo nome que a pasta** (`projetos/pisid/pisid.md`) e usa o template `fonte`.
- As subpastas por tipo só se criam quando há ficheiros desse tipo.
- Tudo o que está dentro da pasta da fonte, além da nota principal, é um anexo.

## Anexos
- Cada anexo tem uma linha na tabela `## Anexos` da nota principal: caminho relativo à pasta da fonte (por exemplo `imagens/capa.png`), descrição do conteúdo e `Publicar` (`sim` ou `nao`).
- Um anexo sem linha na tabela é ambíguo: não o uses nem o publiques. Regista-o no handoff.
- Podes acrescentar a linha de um anexo que analisaste (descrição), sempre com `Publicar: nao`. Só o utilizador muda para `sim`.
- `publicar: nao` na fonte vale para todos os anexos dela, seja qual for a coluna.
- Os originais nunca vão diretamente para `07-Projeto/`. A versão usada no produto (redimensionada, cortada, convertida) é criada lá, a partir do original.

## Regras
- Não reescrevas nem "melhores" o que o utilizador escreveu aqui. Se for preciso estruturar, cria uma nota em `03-Conhecimento/` que cite a fonte.
- Cada fonte tem `confirmado: sim|nao` (o utilizador validou os dados?) e `publicar: sim|nao|parcial` (pode ir para o produto público?). Só o utilizador altera estas duas propriedades.
- Dados com `confirmado: nao` são hipóteses: usa-os para fazer perguntas, nunca para escrever no `07-Projeto/`.
- Se o produto é público, tudo o que for para `07-Projeto/` fica público.
- Não inventes campos em falta. Pergunta ao utilizador ou regista uma lacuna.
- Pastas e ficheiros que começam por `_` são modelos ou rascunhos e não entram nas validações nem no índice.
- Não edites `Indice-de-fontes.md`: é regenerado.
