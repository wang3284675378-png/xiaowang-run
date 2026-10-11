import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, '..');
const siteDir = path.join(projectDir, 'outputs');
const indexPath = path.join(siteDir, 'index.html');
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`失败：${message}`);
}

function pass(message) {
  console.log(`通过：${message}`);
}

function requireFile(relativePath) {
  const absolutePath = path.join(siteDir, relativePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    fail(`缺少文件 outputs/${relativePath}`);
    return false;
  }
  pass(`找到 outputs/${relativePath}`);
  return true;
}

if (!requireFile('index.html')) process.exit(1);

const html = fs.readFileSync(indexPath, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);

if (!scriptMatch) {
  fail('index.html 中没有找到游戏脚本');
} else {
  try {
    new Function(scriptMatch[1]);
    pass('游戏 JavaScript 语法正确');
  } catch (error) {
    fail(`游戏 JavaScript 语法错误：${error.message}`);
  }
}

const references = new Set();
for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"'#]+)["']/gi)) references.add(match[1]);
for (const match of html.matchAll(/(?:avatar|gameOver)\s*:\s*["']([^"']+)["']/g)) references.add(match[1]);

for (const reference of references) {
  if (/^(?:https?:|data:|#)/i.test(reference)) continue;
  const normalized = reference.replace(/^\.\//, '');
  const absolutePath = path.resolve(siteDir, normalized);
  if (!absolutePath.startsWith(siteDir + path.sep)) {
    fail(`资源路径超出发布目录：${reference}`);
  } else {
    requireFile(normalized);
  }
}

if (/https?:\/\//i.test(html)) fail('页面包含外部网络资源，请确认大陆访问稳定性');
else pass('页面不依赖外部 CDN 或接口');

if (/[A-Za-z]:\\/.test(html)) fail('页面包含本机绝对路径');
else pass('页面没有本机绝对路径');

if (/【[^】]+】/.test(html)) fail('页面仍包含未替换的占位符');
else pass('页面没有未替换的路径占位符');

const releaseFiles = [];
function collectFiles(directory, prefix = '') {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(prefix, entry.name);
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(absolutePath, relativePath);
    else releaseFiles.push({ path: relativePath, bytes: fs.statSync(absolutePath).size });
  }
}
collectFiles(siteDir);

console.log('\n最终服务器上传文件：');
for (const file of releaseFiles) console.log(`- ${file.path} (${file.bytes} bytes)`);

if (failures.length) {
  console.error(`\n发布检查未通过，共 ${failures.length} 项问题。`);
  process.exit(1);
}

console.log('\n发布检查全部通过。此项目不需要构建，直接上传 outputs 目录中的内容。');
