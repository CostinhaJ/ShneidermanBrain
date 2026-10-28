#!/usr/bin/env node
// Regenera os índices do cofre e valida as notas. Sem dependências (só Node).
//
// Uso (a partir de qualquer pasta dentro do cofre):
//   node .claude/skills/regenerar-indices/regen.mjs              regenera índices e valida
//   node .claude/skills/regenerar-indices/regen.mjs --verificar  só valida (não escreve nada)
//   node .claude/skills/regenerar-indices/regen.mjs --raiz <pasta>
//
// Escreve apenas: 00-Mapa/Conhecido-vs-por-saber.md, 00-Mapa/Evolucao.md,
// 00-Mapa/Skills-e-Personas.md e o bloco AUTO dentro de cada nota de 1-Dominios/.

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
if (!soVerificar) for (const g of ['Conhecido-vs-por-saber', 'Evolucao', 'Skills-e-Personas']) nomes.add(g.toLowerCase());
const porNome = new Map(notas.map((n) => [n.nome.toLowerCase(), n]));
const eModelo = (n) => n.rel.startsWith('99-Sistema/');
const eGuia = (n) => n.nome === 'CLAUDE.md'.replace('.md', '');

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
    if (a && !nomes.has(a.toLowerCase()) && !/\.(canvas|png|jpg|svg|pdf)$/i.test(a)) {
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

  // 4) Bloco AUTO em cada nota de domínio
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
