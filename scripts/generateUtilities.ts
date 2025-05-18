// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';
import postcssScss from 'postcss-scss';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { spawnSync } from 'child_process';

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

// --- Sass変数の値を取得する（stderrから@debug出力をパース） ---
function getSassVariableValue(variable: string): any {
  const tmpSass = `@import 'vuetify/lib/styles/settings/_variables.scss';\n@debug ${variable};`;
  // 一時ファイルに書き出し
  const tmpPath = path.resolve(process.cwd(), 'scripts/tmp-get-var.scss');
  fs.writeFileSync(tmpPath, tmpSass, 'utf-8');
  // sassコマンド実行
  const result = spawnSync(
    'npx',
    ['sass', '--load-path=node_modules', tmpPath],
    { encoding: 'utf-8' }
  );
  // stderr全体を出力
  console.log('SASS stderr:', result.stderr);
  // stderrから@debug出力を抽出（大文字小文字問わず）
  const debugLine = result.stderr
    .split('\n')
    .find((line) => /debug:/i.test(line));
  if (!debugLine) return null;
  // (0: 0px, 1: 4px, ...) 形式をパース
  const obj: Record<string, string> = {};
  const match = debugLine.match(/\((.*)\)/);
  if (match) {
    match[1].split(',').forEach((pair) => {
      const [k, v] = pair.split(':').map((s) => s.trim());
      if (k && v) obj[k] = v;
    });
  }
  return obj;
}

const spacersValue = getSassVariableValue('$spacers');
console.log('SASS $spacers:', spacersValue);
const roundedValue = getSassVariableValue('$rounded');
console.log('SASS $rounded:', roundedValue);
const bordersValue = getSassVariableValue('$borders');
console.log('SASS $borders:', bordersValue);
const borderOpacitiesValue = getSassVariableValue('$border-opacities');
console.log('SASS $border-opacities:', borderOpacitiesValue);
const opacitiesValue = getSassVariableValue('$opacities');
console.log('SASS $opacities:', opacitiesValue);
const fontWeightsValue = getSassVariableValue('$font-weights');
console.log('SASS $font-weights:', fontWeightsValue);
const negativeSpacersValue = getSassVariableValue('$negative-spacers');
console.log('SASS $negative-spacers:', negativeSpacersValue);

// --- ユーティリティ情報の値をSass変数で置換 ---
function expandValues(
  val: string,
  spacers: Record<string, string>,
  rounded: Record<string, string>,
  borders: Record<string, string>,
  borderOpacities: Record<string, string>,
  opacities: Record<string, string>,
  fontWeights: Record<string, string>,
  negativeSpacers: Record<string, string>
): Record<string, string> | string {
  if (val.startsWith('map.merge(variables.$spacers')) {
    return { ...spacers, auto: 'auto' };
  }
  if (val === 'variables.$spacers') {
    return { ...spacers };
  }
  if (val === 'variables.$rounded') {
    return { ...rounded };
  }
  if (val === 'variables.$borders') {
    return { ...borders };
  }
  if (val === 'variables.$border-opacities') {
    return { ...borderOpacities };
  }
  if (val === 'variables.$opacities') {
    return { ...opacities };
  }
  if (val === 'variables.$font-weights') {
    return { ...fontWeights };
  }
  if (val === 'variables.$negative-spacers') {
    return { ...negativeSpacers };
  }
  return val;
}

// ユーティリティ情報を抽出
const utilities: Array<{ key: string; props: Record<string, any> }> = [];
const mapRoot = (mapAst.nodes[0] as any)?.nodes[0]?.value;
if (typeof mapRoot !== 'string') {
  throw new Error('map再パース失敗');
}
const utilRegex = /"([^"]+)": \(([^\)]*)\)/g;
let match;
while ((match = utilRegex.exec(mapRoot)) !== null) {
  const key = match[1];
  const body = match[2];
  const props: Record<string, any> = {};
  body.split(',').forEach((line) => {
    const kv = line.split(':').map((s) => s.trim());
    if (kv.length === 2) {
      if (kv[0] === 'values') {
        props.values = expandValues(
          kv[1],
          spacersValue,
          roundedValue,
          bordersValue,
          borderOpacitiesValue,
          opacitiesValue,
          fontWeightsValue,
          negativeSpacersValue
        );
      } else {
        props[kv[0]] = kv[1];
      }
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
