import { readFileSync } from 'node:fs';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const source = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');

assert(
  source.includes('@ 2026 Developed by 사무처 시설관리팀장 나형석'),
  'App header credit should include the requested developer line',
);

console.log('app header test passed');
