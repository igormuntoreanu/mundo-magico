import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = new URL("../src/data/stories/full/", import.meta.url);
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .sort((a, b) => {
    const rank = (f) => (f.startsWith("g") ? 0 : 1);
    return rank(a) - rank(b) || a.localeCompare(b);
  });

const rows = files.map((file) => {
  const text = readFileSync(new URL(file, dir), "utf8");
  const name = text.match(/export const ([A-Za-z0-9_]+)/)?.[1];
  if (!name) throw new Error(`no export in ${file}`);
  return { file: file.replace(/\.ts$/, ""), name };
});

const body = `/** Grouped drafts first; country files override them. */
${rows.map((r) => `import { ${r.name} } from "./${r.file}";`).join("\n")}

export const FULL_STORIES: Record<string, string[]> = {
${rows.map((r) => `  ...${r.name},`).join("\n")}
};
`;
writeFileSync(new URL("index.ts", dir), body);
console.log("wired", rows.map((r) => r.name).join(", "));
