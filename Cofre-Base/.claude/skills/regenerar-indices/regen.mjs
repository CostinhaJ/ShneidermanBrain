#!/usr/bin/env node
// Regenera os índices do cofre e valida as notas. Sem dependências (só Node).
//
// Uso (a partir de qualquer pasta dentro do cofre):
//   node .claude/skills/regenerar-indices/regen.mjs              regenera índices e valida
//   node .claude/skills/regenerar-indices/regen.mjs --verificar  só valida (não escreve nada)
//   node .claude/skills/regenerar-indices/regen.mjs --raiz <pasta>
//
// Escreve apenas: 00-Mapa/Conhecido-vs-por-saber.md, 00-Mapa/Evolucao.md,
// 00-Mapa/Skills-e-Personas.md, 05-Fontes/Indice-de-fontes.md e o bloco AUTO
// dentro de cada nota de 1-Dominios/.

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const soVerificar = args.includes('--verificar');
const iRaiz = args.indexOf('--raiz');

// ---- encontrar a raiz do cofre (pasta que contém 00-Mapa) ----
let raiz = path.resolve(iRaiz >= 0 ? args[iRaiz + 1] : process.cwd());
for (let p = raiz; ; p = path.dirname(p)) {
  if (fs.existsSync(path.join(p, '00-Mapa'))) { raiz = p; break; }
  if (path.dirname(p) === p) { console.error('Não encontrei 00-Mapa. Corra dentro do cofre ou use --raiz.'); process.exit(2); }
}

const hoje = new Date().toISOString().slice(0, 10);
const ZONAS = ['00-Mapa', '01-Objetivos', '03-Conhecimento', '05-Fontes', '06-Registo', '99-Sistema'];
const ESTADOS_NOTA = ['por-saber', 'proposto', 'verificado', 'obsoleto'];
const ESTADOS_OBJ = ['aberto', 'em-curso', 'concluido'];
const ESTADOS_HANDOFF = ['concluido', 'parcial', 'bloqueado'];
const TIPO_POR_PASTA = { '1-Dominios': 'dominio', '2-Conceitos': 'conceito', '3-Detalhe': 'detalhe', 'Lacunas': 'lacuna' };

// ---- utilitários ----
const posix = (p) => p.split(path.sep).join('/');
const lerTxt = (f) => fs.readFileSync(f, 'utf8');
function limpa(s) {
  s = s.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  return s;
}
function lerFM(txt) {
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: null, corpo: txt };
  const fm = {};
  for (const linha of m[1].split(/\r?\n/)) {
    const k = linha.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!k) continue;
    let v = k[2].trim();
    if (v.startsWith('[') && v.endsWith(']') && !v.startsWith('[[')) {
      v = v.slice(1, -1).split(',').map(limpa).filter(Boolean);
    } else v = limpa(v);
    fm[k[1]] = v;
  }
  return { fm, corpo: txt.slice(m[0].length) };
}
const alvoLink = (s) => s.replace(/^\[\[|\]\]$/g, '').split('|')[0].split('#')[0].trim().split('/').pop().replace(/\.md$/, '');
const celula = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
function* percorrer(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* percorrer(p);
    else if (e.isFile() && e.name.endsWith('.md')) yield p;
  }
}
function escrever(rel, conteudo) {
  const f = path.join(raiz, rel);
  const antes = fs.existsSync(f) ? lerTxt(f) : null;
  if (antes === conteudo) return false;
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, conteudo);
  escritos.push(rel);
  return true;
}

// ---- recolher notas ----
const escritos = [];
const erros = [];
const avisos = [];
const notas = [];
for (const z of ZONAS) {
  for (const f of percorrer(path.join(raiz, z))) {
    const rel = posix(path.relative(raiz, f));
    const txt = lerTxt(f);
    const { fm, corpo } = lerFM(txt);
    notas.push({ rel, nome: path.basename(f, '.md'), fm, corpo, zona: z });
  }
}
const nomes = new Set(notas.map((n) => n.nome.toLowerCase()));
// Índices que esta execução vai criar: não contam como links partidos na primeira vez.
if (!soVerificar) for (const g of ['Conhecido-vs-por-saber', 'Evolucao', 'Skills-e-Personas', 'Indice-de-fontes']) nomes.add(g.toLowerCase());
const porNome = new Map(notas.map((n) => [n.nome.toLowerCase(), n]));
const eModelo = (n) => n.rel.startsWith('99-Sistema/');
const eGuia = (n) => n.nome === 'CLAUDE.md'.replace('.md', '');

// ---- fontes: 05-Fontes/<assunto>/<fonte>/<fonte>.md + anexos em subpastas por tipo ----
const TIPOS_ANEXO = {
  imagens: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif', 'heic'],
  videos: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'],
  audio: ['mp3', 'wav', 'm4a', 'ogg', 'flac'],
  documentos: null, // qualquer extensão
};
const PUBLICAR_FONTE = ['sim', 'nao', 'parcial'];
const PUBLICAR_ANEXO = ['sim', 'nao'];
const FICHEIROS_RAIZ_FONTES = ['CLAUDE.md', 'Indice-de-fontes.md'];
const fontes = [];
const subdirs = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory() && !/^[._]/.test(e.name)).map((e) => e.name).sort() : []);
const ficheirosEm = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isFile() && !e.name.startsWith('.')).map((e) => e.name) : []);
function* todosOsFicheiros(dir, base = dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* todosOsFicheiros(p, base);
    else if (e.isFile()) yield posix(path.relative(base, p));
  }
}
function lerTabelaAnexos(corpo) {
  const linhas = corpo.split(/\r?\n/);
  const i = linhas.findIndex((l) => /^##\s+Anexos\s*$/i.test(l.trim()));
  if (i < 0) return null;
  const linhasTabela = [];
  for (const l of linhas.slice(i + 1)) {
    if (!l.trim()) { if (linhasTabela.length) break; continue; }
    if (!l.trim().startsWith('|')) break;
    linhasTabela.push(l.trim());
  }
  return linhasTabela.slice(2).map((l) => {
    const c = l.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((s) => s.trim());
    const ref = (c[0] || '').replace(/`/g, '').replace(/^!?\[\[|\]\]$/g, '').split('\\|')[0].trim();
    return { ref, descricao: c[1] || '', publicar: (c[2] || '').toLowerCase() };
  }).filter((a) => a.ref);
}
const raizFontes = path.join(raiz, '05-Fontes');
for (const f of ficheirosEm(raizFontes)) if (!FICHEIROS_RAIZ_FONTES.includes(f) && !f.startsWith('_')) avisos.push(`05-Fontes/${f}: fora da estrutura (deve estar em 05-Fontes/<assunto>/<fonte>/)`);
for (const assunto of subdirs(raizFontes)) {
  const dirAssunto = path.join(raizFontes, assunto);
  for (const f of ficheirosEm(dirAssunto)) if (!f.startsWith('_')) avisos.push(`05-Fontes/${assunto}/${f}: fora da estrutura (cada fonte é uma pasta com <fonte>/<fonte>.md)`);
  for (const nome of subdirs(dirAssunto)) {
    const dirFonte = path.join(dirAssunto, nome);
    const relDir = `05-Fontes/${assunto}/${nome}`;
    const nota = notas.find((n) => n.rel === `${relDir}/${nome}.md`);
    const fonte = { assunto, nome, relDir, nota, fm: nota?.fm || {}, anexos: [], semDescricao: [] };
    fontes.push(fonte);
    if (!nota) { erros.push(`${relDir}: fonte sem nota principal (esperado ${nome}.md, com o mesmo nome da pasta)`); }
    else {
      exige(nota, ['tipo', 'confirmado', 'publicar', 'atualizado']);
      if (nota.fm?.tipo && nota.fm.tipo !== 'fonte') erros.push(`${nota.rel}: tipo "${nota.fm.tipo}" numa nota principal de fonte (esperado "fonte")`);
      if (nota.fm?.confirmado && !['sim', 'nao'].includes(nota.fm.confirmado)) erros.push(`${nota.rel}: confirmado inválido "${nota.fm.confirmado}" (sim ou nao)`);
      if (nota.fm?.publicar && !PUBLICAR_FONTE.includes(nota.fm.publicar)) erros.push(`${nota.rel}: publicar inválido "${nota.fm.publicar}" (sim, nao ou parcial)`);
      if (nota.fm && !nota.fm.resumo) avisos.push(`${nota.rel}: sem "resumo" (o índice de fontes fica sem descrição)`);
    }
    const ficheiros = [...todosOsFicheiros(dirFonte)].filter((r) => r !== `${nome}.md`);
    const tabela = nota ? lerTabelaAnexos(nota.corpo) : null;
    if (nota && ficheiros.length && tabela === null) erros.push(`${nota.rel}: tem anexos mas não tem a secção "## Anexos"`);
    const usados = new Set();
    for (const a of tabela || []) {
      let alvo = ficheiros.find((r) => r === a.ref);
      if (!alvo) {
        const iguais = ficheiros.filter((r) => r.split('/').pop() === a.ref.split('/').pop());
        if (iguais.length === 1) alvo = iguais[0];
        else if (iguais.length > 1) { erros.push(`${nota.rel}: anexo "${a.ref}" é ambíguo (${iguais.join(', ')}); use o caminho relativo`); continue; }
      }
      if (!alvo) { erros.push(`${nota.rel}: anexo listado não existe: ${a.ref}`); continue; }
      usados.add(alvo);
      if (!PUBLICAR_ANEXO.includes(a.publicar)) erros.push(`${nota.rel}: anexo ${alvo} com Publicar inválido "${a.publicar}" (sim ou nao)`);
      if (a.publicar === 'sim' && fonte.fm.publicar === 'nao') erros.push(`${nota.rel}: anexo ${alvo} com Publicar sim numa fonte com publicar: nao`);
      if (!a.descricao) avisos.push(`${nota.rel}: anexo ${alvo} sem descrição`);
      fonte.anexos.push({ rel: alvo, publicar: a.publicar, descricao: a.descricao });
    }
    for (const r of ficheiros) {
      const [pasta, ...resto] = r.split('/');
      const ext = r.split('.').pop().toLowerCase();
      if (!resto.length) avisos.push(`${relDir}/${r}: anexo fora de uma subpasta por tipo (${Object.keys(TIPOS_ANEXO).join(', ')})`);
      else if (!(pasta in TIPOS_ANEXO)) avisos.push(`${relDir}/${r}: subpasta "${pasta}" desconhecida (${Object.keys(TIPOS_ANEXO).join(', ')})`);
      else if (TIPOS_ANEXO[pasta] && !TIPOS_ANEXO[pasta].includes(ext)) avisos.push(`${relDir}/${r}: extensão .${ext} não pertence a ${pasta}/`);
      if (!usados.has(r)) { fonte.semDescricao.push(r); avisos.push(`${relDir}/${r}: anexo sem linha na tabela "## Anexos" (ambíguo: não usar nem publicar)`); }
    }
  }
}

// ---- validação ----
function exige(n, chaves) {
  for (const k of chaves) if (!n.fm || n.fm[k] === undefined || n.fm[k] === '') erros.push(`${n.rel}: falta a propriedade "${k}"`);
}
for (const n of notas) {
  if (eModelo(n) || eGuia(n)) continue;
  const partes = n.rel.split('/');
  if (partes[0] === '03-Conhecimento' && TIPO_POR_PASTA[partes[1]] && partes.length === 3 && !n.nome.startsWith('_')) {
    const tipo = TIPO_POR_PASTA[partes[1]];
    exige(n, tipo === 'dominio' ? ['tipo', 'estado', 'resumo', 'atualizado'] : ['tipo', 'dominio', 'estado', 'resumo', 'atualizado']);
    if (!n.fm) continue;
    if (n.fm.tipo && n.fm.tipo !== tipo) erros.push(`${n.rel}: tipo "${n.fm.tipo}" não corresponde à pasta (esperado "${tipo}")`);
    if (n.fm.estado && !ESTADOS_NOTA.includes(n.fm.estado)) erros.push(`${n.rel}: estado inválido "${n.fm.estado}"`);
    if (n.fm.estado === 'verificado' && !n.fm.verificado_por) erros.push(`${n.rel}: estado verificado exige "verificado_por"`);
    if (n.fm.resumo && n.fm.resumo.length > 200) avisos.push(`${n.rel}: resumo com ${n.fm.resumo.length} caracteres (ideal até 200)`);
    if (tipo !== 'dominio' && n.fm.dominio) {
      const d = porNome.get(alvoLink(n.fm.dominio).toLowerCase());
      if (!d || d.fm?.tipo !== 'dominio') erros.push(`${n.rel}: "dominio" não aponta para uma nota de domínio existente (${n.fm.dominio})`);
    }
  } else if (n.zona === '06-Registo' && !n.nome.startsWith('_')) {
    exige(n, ['tipo', 'objetivo', 'estado', 'resumo', 'atualizado']);
    if (n.fm?.estado && !ESTADOS_HANDOFF.includes(n.fm.estado)) erros.push(`${n.rel}: estado de handoff inválido "${n.fm.estado}"`);
  } else if (n.zona === '01-Objetivos' && /^OBJ-/.test(n.nome)) {
    exige(n, ['tipo', 'id', 'persona', 'estado', 'resumo']);
    if (n.fm?.estado && !ESTADOS_OBJ.includes(n.fm.estado)) erros.push(`${n.rel}: estado de objetivo inválido "${n.fm.estado}"`);
  }
  // links partidos (os índices gerados são reescritos nesta execução, por isso só avisam em --verificar)
  const gerado = n.fm?.gerado === 'true';
  if (gerado && !soVerificar) continue;
  const semCodigo = n.corpo.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  const textoLinks = semCodigo + '\n' + (n.fm ? Object.values(n.fm).flat().join('\n') : '');
  for (const m of textoLinks.matchAll(/\[\[([^\]]+)\]\]/g)) {
    const a = alvoLink(m[0]);
    if (a && !nomes.has(a.toLowerCase()) && !/\.(?!md$)[a-z0-9]{1,8}$/i.test(a)) {
      if (gerado) { avisos.push(`${n.rel}: índice desatualizado (link [[${m[1]}]]); corra regenerar-indices sem --verificar`); break; }
      erros.push(`${n.rel}: link partido [[${m[1]}]]`);
    }
  }
}

// ---- geração ----
if (!soVerificar) {
  const conhecimento = notas.filter(
    (n) => n.rel.startsWith('03-Conhecimento/') && n.fm && ['conceito', 'detalhe', 'lacuna', 'dominio'].includes(n.fm.tipo) && !n.nome.startsWith('_'),
  );
  const dominios = conhecimento.filter((n) => n.fm.tipo === 'dominio').map((n) => n.nome).sort();
  const nomeDominio = (n) => (n.fm.tipo === 'dominio' ? n.nome : alvoLink(n.fm.dominio || '') || '(sem domínio)');
  const linhaNota = (n) =>
    `| [[${n.nome}]] | ${celula(nomeDominio(n))} | ${celula(n.fm.tipo)} | ${celula(n.fm.confianca || '')} | ${celula(n.fm.resumo)} |`;

  // 1) Conhecido vs por saber
  let md = `---\ntipo: indice\ngerado: true\natualizado: ${hoje}\n---\n`;
  md += `# Conhecido vs por saber\n\n> Gerado por \`regenerar-indices\`. Não editar: as alterações perdem-se. Para mudar, altere o \`estado\` da nota.\n\n`;
  md += `## Visão por domínio\n\n| Domínio | por-saber | proposto | verificado | obsoleto |\n|---|---:|---:|---:|---:|\n`;
  const nCont = (d, e) => conhecimento.filter((n) => n.fm.tipo !== 'dominio' && nomeDominio(n) === d && n.fm.estado === e).length;
  for (const d of dominios) md += `| [[${d}]] | ${ESTADOS_NOTA.map((e) => nCont(d, e)).join(' | ')} |\n`;
  for (const e of ESTADOS_NOTA) {
    const lista = conhecimento.filter((n) => n.fm.tipo !== 'dominio' && n.fm.estado === e).sort((a, b) => a.nome.localeCompare(b.nome));
    md += `\n## ${e} (${lista.length})\n\n`;
    if (!lista.length) { md += '_Nenhuma._\n'; continue; }
    md += `| Nota | Domínio | Tipo | Confiança | Resumo |\n|---|---|---|---|---|\n` + lista.map(linhaNota).join('\n') + '\n';
  }
  escrever('00-Mapa/Conhecido-vs-por-saber.md', md);

  // 2) Evolução (objetivos + handoffs)
  const objs = notas.filter((n) => n.zona === '01-Objetivos' && /^OBJ-/.test(n.nome) && n.fm).sort((a, b) => a.nome.localeCompare(b.nome));
  const hands = notas.filter((n) => n.zona === '06-Registo' && n.fm?.tipo === 'handoff').sort((a, b) => String(b.fm.atualizado).localeCompare(String(a.fm.atualizado)) || b.nome.localeCompare(a.nome));
  md = `---\ntipo: indice\ngerado: true\natualizado: ${hoje}\n---\n# Evolução\n\n> Gerado por \`regenerar-indices\`. Não editar.\n\n## Objetivos\n\n`;
  md += objs.length
    ? `| Objetivo | Estado | Persona | Resumo |\n|---|---|---|---|\n` + objs.map((n) => `| [[${n.nome}]] | ${celula(n.fm.estado)} | ${celula(n.fm.persona)} | ${celula(n.fm.resumo)} |`).join('\n') + '\n'
    : '_Nenhum objetivo ainda._\n';
  md += `\n## Registo de tarefas (mais recentes primeiro)\n\n`;
  md += hands.length
    ? `| Data | Handoff | Objetivo | Estado | Resumo |\n|---|---|---|---|---|\n` + hands.slice(0, 40).map((n) => `| ${celula(n.fm.atualizado)} | [[${n.nome}]] | ${celula(n.fm.objetivo)} | ${celula(n.fm.estado)} | ${celula(n.fm.resumo)} |`).join('\n') + '\n'
    : '_Nenhuma tarefa concluída ainda._\n';
  escrever('00-Mapa/Evolucao.md', md);

  // 3) Skills e personas (a partir de .claude/ e dos rascunhos)
  const descricao = (f) => {
    const { fm } = lerFM(lerTxt(f));
    const d = (fm?.description || '').replace(/\s+/g, ' ');
    return d.length > 170 ? d.slice(0, 167) + '...' : d;
  };
  const listar = (dir, ficheiro) => {
    const base = path.join(raiz, dir);
    if (!fs.existsSync(base)) return [];
    return fs.readdirSync(base, { withFileTypes: true })
      .filter((e) => (ficheiro ? e.isDirectory() && fs.existsSync(path.join(base, e.name, ficheiro)) : e.isFile() && e.name.endsWith('.md')))
      .map((e) => ({ nome: ficheiro ? e.name : e.name.replace(/\.md$/, ''), desc: descricao(ficheiro ? path.join(base, e.name, ficheiro) : path.join(base, e.name)) }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  };
  const tabela = (itens) => (itens.length ? `| Nome | Descrição |\n|---|---|\n` + itens.map((i) => `| \`${i.nome}\` | ${celula(i.desc)} |`).join('\n') + '\n' : '_Nenhuma._\n');
  md = `---\ntipo: indice\ngerado: true\natualizado: ${hoje}\n---\n# Skills e personas\n\n> Gerado por \`regenerar-indices\`. Os ficheiros reais vivem em \`.claude/\` (pasta oculta no Obsidian).\n\n`;
  md += `## Personas (\`.claude/agents/\`)\n\n${tabela(listar('.claude/agents', null))}\n## Skills ativas (\`.claude/skills/\`)\n\n${tabela(listar('.claude/skills', 'SKILL.md'))}\n`;
  md += `## Rascunhos de skills (\`99-Sistema/Skills-rascunho/\`)\n\n${tabela(listar('99-Sistema/Skills-rascunho', 'SKILL.md'))}`;
  escrever('00-Mapa/Skills-e-Personas.md', md);

  // 4) Índice de fontes
  md = `---\ntipo: indice\ngerado: true\natualizado: ${hoje}\n---\n# Índice de fontes\n\n> Gerado por \`regenerar-indices\`. Não editar. Estrutura: \`05-Fontes/<assunto>/<fonte>/<fonte>.md\`, anexos em \`imagens/\`, \`videos/\`, \`audio/\`, \`documentos/\`.\n\n`;
  const assuntos = [...new Set(fontes.map((f) => f.assunto))];
  if (!assuntos.length) md += '_Nenhuma fonte ainda._\n\n';
  for (const a of assuntos) {
    const l = fontes.filter((f) => f.assunto === a);
    md += `## ${a} (${l.length})\n\n| Fonte | Confirmado | Publicar | Anexos | Resumo |\n|---|---|---|---|---|\n`;
    md += l.map((f) => {
      const total = f.anexos.length + f.semDescricao.length;
      const anexos = total ? `${total}${f.semDescricao.length ? ` (${f.semDescricao.length} sem descrição)` : ''}` : '0';
      return `| ${f.nota ? `[[${f.nome}]]` : `${celula(f.nome)} (sem nota)`} | ${celula(f.fm.confirmado)} | ${celula(f.fm.publicar)} | ${anexos} | ${celula(f.fm.resumo)} |`;
    }).join('\n') + '\n\n';
  }
  const porRever = fontes.flatMap((f) => f.semDescricao.map((r) => `${f.relDir}/${r}`));
  md += `## Anexos sem descrição (${porRever.length})\n\nNão usar nem publicar até terem uma linha na tabela "Anexos" da fonte.\n\n`;
  md += porRever.length ? porRever.map((r) => `- \`${r}\``).join('\n') + '\n' : '_Nenhum._\n';
  escrever('05-Fontes/Indice-de-fontes.md', md);

  // 5) Bloco AUTO em cada nota de domínio
  for (const d of conhecimento.filter((n) => n.fm.tipo === 'dominio')) {
    const filhos = conhecimento.filter((n) => n.fm.tipo !== 'dominio' && nomeDominio(n) === d.nome);
    let bloco = '<!-- AUTO:INICIO (gerado, não editar) -->\n';
    for (const [tipo, titulo] of [['conceito', 'Conceitos'], ['detalhe', 'Detalhe'], ['lacuna', 'Lacunas']]) {
      const l = filhos.filter((n) => n.fm.tipo === tipo).sort((a, b) => a.nome.localeCompare(b.nome));
      bloco += `\n**${titulo} (${l.length})**\n`;
      bloco += l.length ? l.map((n) => `- [[${n.nome}]] (${n.fm.estado}) — ${n.fm.resumo}`).join('\n') + '\n' : '- _nenhum_\n';
    }
    bloco += '\n<!-- AUTO:FIM -->';
    const f = path.join(raiz, d.rel);
    let txt = lerTxt(f);
    txt = /<!-- AUTO:INICIO[\s\S]*?<!-- AUTO:FIM -->/.test(txt)
      ? txt.replace(/<!-- AUTO:INICIO[\s\S]*?<!-- AUTO:FIM -->/, () => bloco)
      : txt.replace(/\s*$/, '\n\n## Notas deste domínio\n\n') + bloco + '\n';
    escrever(d.rel, txt);
  }
}

// ---- relatório ----
console.log(`Cofre: ${raiz}`);
console.log(soVerificar ? 'Modo: só verificação' : `Ficheiros atualizados: ${escritos.length}${escritos.length ? '\n  - ' + escritos.join('\n  - ') : ''}`);
for (const a of avisos) console.log(`AVISO  ${a}`);
for (const e of erros) console.log(`ERRO   ${e}`);
console.log(erros.length ? `\n${erros.length} erro(s).` : '\nValidação OK.');
process.exit(erros.length ? 1 : 0);
