import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { QWEN_CONTEXT_CHOICES, QWEN_CONTEXT_NOTE, qwenContexts } from '../src/lib/qwen-context.ts';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('Flash-Next offers 1M both with the catalog and while the catalog loads', () => {
  assert.equal(qwenContexts().at(-1), 1048576);
  for (const family of ['qwen', 'coder', 'swift', 'unsloth', 'gyro', 'nvfp4']) {
    assert.deepEqual(qwenContexts(QWEN_CONTEXT_CHOICES, family), QWEN_CONTEXT_CHOICES);
  }
  const setup = read('../../../setup.py');
  const choices = JSON.parse(setup.match(/^CONTEXTS = (\[.*\])/m)[1]);
  assert.deepEqual(choices, QWEN_CONTEXT_CHOICES, 'the app and setup offer the same sizes');
  assert.deepEqual(qwenContexts([32768, 131072], 'qwen'), [32768, 131072], 'honor a catalog with fewer choices');
});

test('the separate Qwen3.6 engine path keeps its existing choices without the new 1M entry', () => {
  assert.deepEqual(qwenContexts(QWEN_CONTEXT_CHOICES, 'qwen36'), QWEN_CONTEXT_CHOICES.filter(n => n < 1048576));
});

test('the extension note is translated in every supported language', () => {
  for (const lang of ['en', 'ja', 'zh', 'de', 'es', 'ru', 'pt', 'ko', 'fr']) {
    const text = JSON.parse(read(`../src/locales/fix-${lang}.json`)).fxqwen1m;
    assert.ok(text);
    if (lang === 'en') assert.equal(text, QWEN_CONTEXT_NOTE);
    else assert.notEqual(text, QWEN_CONTEXT_NOTE);
  }
});
