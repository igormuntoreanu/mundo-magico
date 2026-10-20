#!/usr/bin/env node
/**
 * High-signal locale checker for Mundo Mágico copy.
 *
 * Usage:
 *   node check-locale.mjs --locale en-GB path/to/file
 *   node check-locale.mjs --locale fr-FR --json path/to/file
 *
 * It only flags mistakes that are almost never intentional. It is a helper,
 * not a proof of correctness: read the locale reference as well.
 */
import { readFileSync } from "node:fs";

const RULES = {
  "pt-BR": [
    [/\b(telem[óo]vel|autocarro|pequeno-almo[çc]o|ecr[ãa]|comboio|frigor[íi]fico|gelado|rapariga|sapatilhas)\b/giu, "pt-PT term"],
    [/\b(est[áa]s|est[áa] a [a-zà-ú]+|fazes|vais|tens)\b/giu, "pt-PT second person or progressive"],
    [/\b(casa de banho)\b/giu, "pt-PT term"],
    [/\b(id[ée]ia|v[ôo]o|alug[úu]el|her[óo]ico|jib[óo]ia|ling[üu]i[çc]a|conseq[üu][êe]ncia)\b/giu, "pre-Acordo spelling"],
  ],
  "en-GB": [
    [/\b(color|honor|favor|center|theater|organize|recognize|realize|defense|traveled|canceled|modeling|catalog|dialog|gray|mom|truck|sidewalk|vacation|math|diaper|elevator|apartment|garbage|cookie|fries)\b/giu, "American spelling or vocabulary"],
    [/\b(traveling|signaling|canceling)\b/giu, "American doubled consonant"],
  ],
  "de-DE": [
    [/\b(J[äa]nner|Erdapfel|Paradeiser|Karfiol|Sackerl|Trottoir|Velo|Gr[üu]ezi|Obers|Semmel)\b/gu, "Austrian or Swiss term"],
    [/\bdaß\b/gu, "old spelling of dass"],
    [/\b(ss|SS)tra(ss|ß)e\b/gu, "Swiss ss for ß"],
  ],
  "fr-FR": [
    [/\b(septante|nonante|souper|magasiner|blonde)\b/giu, "Belgian, Swiss or Canadian term"],
    [/[a-zA-ZÀ-ÿ][?!]/gu, "missing space before ? or !"],
    [/«[^\s\u00A0]/gu, "missing space after «"],
    [/[^\s\u00A0]»/gu, "missing space before »"],
  ],
};

function parseArgs(argv) {
  let locale = "";
  let json = false;
  const files = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--locale") locale = argv[++i] ?? "";
    else if (arg === "--json") json = true;
    else files.push(arg);
  }
  return { locale, json, files };
}

const { locale, json, files } = parseArgs(process.argv.slice(2));
const rules = RULES[locale];
if (!rules) {
  console.error(`Unknown --locale "${locale}". Use one of: ${Object.keys(RULES).join(", ")}`);
  process.exit(2);
}
if (files.length === 0) {
  console.error("Usage: node check-locale.mjs --locale <tag> <file> [file...]");
  process.exit(2);
}

const findings = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  for (const [pattern, rule] of rules) {
    for (let i = 0; i < lines.length; i++) {
      pattern.lastIndex = 0;
      const match = pattern.exec(lines[i]);
      if (!match) continue;
      findings.push({ file, line: i + 1, rule, match: match[0], text: lines[i].trim().slice(0, 140) });
    }
  }
}

if (json) {
  console.log(JSON.stringify({ locale, findings }, null, 2));
} else if (findings.length === 0) {
  console.log(`clean: ${files.join(", ")} (${locale})`);
} else {
  for (const f of findings) {
    console.log(`${f.file}:${f.line} [${f.rule}] ${f.match} — ${f.text}`);
  }
  console.log(`\n${findings.length} finding(s) in ${files.length} file(s) (${locale})`);
}
process.exit(findings.length === 0 ? 0 : 1);
