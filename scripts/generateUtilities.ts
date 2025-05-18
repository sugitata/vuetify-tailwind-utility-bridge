// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';
import postcss from 'postcss';
import postcssScss from 'postcss-scss';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const SASS_FILE = path.resolve(
  process.cwd(),
  'node_modules/vuetify/lib/styles/settings/_utilities.scss'
);

const sassContent = fs.readFileSync(SASS_FILE, 'utf-8');

// $utilities: map-deep-merge( ... ) の中身を抽出（カッコのペアを数える）
const mapStart = sassContent.indexOf('map-deep-merge(');
if (mapStart === -1) {
  throw new Error('map-deep-merge not found');
}
let parenCount = 1;
let i = mapStart + 'map-deep-merge('.length;
for (; i < sassContent.length; i++) {
  if (sassContent[i] === '(') parenCount++;
  if (sassContent[i] === ')') parenCount--;
  if (parenCount === 0) break;
}
if (parenCount !== 0) {
  throw new Error('Unmatched parentheses in map-deep-merge');
}
const mapContent = sassContent.substring(
  mapStart + 'map-deep-merge('.length,
  i
);

// コメント除去関数
function removeSassComments(str: string): string {
  // 行コメント
  str = str.replace(/\/\/.*$/gm, '');
  // ブロックコメント
  str = str.replace(/\/\*[\s\S]*?\*\//g, '');
  return str;
}

const cleanedMapContent = removeSassComments(mapContent);
// mapContentをSassのmapとしてラップ
const wrappedMap = `$tmp: (${cleanedMapContent});`;

// postcss-scssでASTパース
const ast = postcssScss.parse(wrappedMap);
console.log(JSON.stringify(ast, null, 2));

// 1段目のASTからmapの中身を取得
const decl = ast.nodes[0];
if (!decl || decl.type !== 'decl') {
  throw new Error('AST構造が想定外です');
}
const mapValue = decl.value;

// mapの中身を再パース
const mapAst = postcssScss.parse(`dummy { dummy: (${mapValue}); }`);

// ユーティリティ情報を抽出
const utilities: Array<{ key: string; props: Record<string, string> }> = [];
const mapRoot = (mapAst.nodes[0] as any)?.nodes[0]?.value;
if (typeof mapRoot !== 'string') {
  throw new Error('map再パース失敗');
}
// 1階層目のユーティリティ定義を正規表現で抽出
const utilRegex = /"([^"]+)": \(([^\)]*)\)/g;
let match;
while ((match = utilRegex.exec(mapRoot)) !== null) {
  const key = match[1];
  const body = match[2];
  // propertyやclass, valuesなどを抽出
  const props: Record<string, string> = {};
  body.split(',').forEach((line) => {
    const kv = line.split(':').map((s) => s.trim());
    if (kv.length === 2) {
      props[kv[0]] = kv[1];
    }
  });
  utilities.push({ key, props });
}
console.log(utilities);

// 出力先ディレクトリとファイル
const outDir = path.resolve(process.cwd(), 'src/generated');
const outFile = path.join(outDir, 'vuetifyUtilities.ts');
if (!existsSync(outDir)) mkdirSync(outDir);

const fileContent = `// Auto-generated from Vuetify _utilities.scss\nexport const vuetifyUtilities = ${JSON.stringify(
  utilities,
  null,
  2
)} as const;\n`;
writeFileSync(outFile, fileContent, 'utf-8');
console.log(`Generated: ${outFile}`);
