import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const scriptPath = new URL('../fuliba-assistant.user.js', import.meta.url);
const source = fs.readFileSync(scriptPath, 'utf8');

execFileSync(process.execPath, ['--check', scriptPath.pathname], {
  stdio: 'inherit',
});

const requiredMetadata = [
  '// @version      1.0.3',
  '// @updateURL    https://raw.githubusercontent.com/lingyuncrystal/fuliba-assistant-mobile/main/fuliba-assistant.user.js',
  '// @downloadURL  https://raw.githubusercontent.com/lingyuncrystal/fuliba-assistant-mobile/main/fuliba-assistant.user.js',
];

const missing = requiredMetadata.filter((entry) => !source.includes(entry));
if (missing.length > 0) {
  console.error(`缺少必要元数据：\n${missing.join('\n')}`);
  process.exit(1);
}

if (!source.includes('@media (max-width: 768px)')) {
  console.error('缺少移动端媒体查询。');
  process.exit(1);
}

const avatarBlurRequirements = [
  '`flb_${location.hostname}_blurAvatar`',
  'GM_getValue(avatarBlurStorageKey, false)',
  'img.avatar',
  '.thread-item-author img',
  '.k-viewavatar img',
  '.comment-author img.avatar',
  'td.pls img[src*="medal"]',
];

const missingAvatarBlurSupport = avatarBlurRequirements.filter(
  (entry) => !source.includes(entry),
);
if (missingAvatarBlurSupport.length > 0) {
  console.error(`头像模糊兼容层不完整：\n${missingAvatarBlurSupport.join('\n')}`);
  process.exit(1);
}

console.log('userscript 语法、自动更新元数据、移动端样式和头像模糊兼容层检查通过。');
