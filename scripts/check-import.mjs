import assert from 'node:assert/strict';
import {parseSpeech,spokenText,speechChunks} from '../app/importer.mjs';
assert.equal(parseSpeech('First paragraph.\r\n\r\nSecond paragraph.').length,2);
const bilingual='## Opening\nEN:\nHello, everyone.\n[pause]\nZH:\n大家好。\n\n## End\nEN:\nThank you.\nZH:\n謝謝。';
const result=parseSpeech(bilingual,'headings');
assert.equal(result.length,2);assert.equal(result[0].title,'Opening');assert.equal(result[0].zh,'大家好。');
assert.equal(spokenText(result[0].en),'Hello, everyone.');
assert.throws(()=>parseSpeech('Hello.\n大家好。'),/英文中含中文/);
assert.throws(()=>parseSpeech('hello\uFFFD'),/UTF-8/);
assert.throws(()=>parseSpeech('No headings','headings'),/未找到標題/);
assert.throws(()=>parseSpeech('   '),/沒有文字/);
assert.equal(speechChunks('I met Dr. Smith. We discussed a project.').join(' ').includes('Dr. Smith'),true);
assert(speechChunks(Array(101).fill('word').join(' ')).every(s=>s.split(/\s+/).length<=35));
assert.equal(spokenText('**Hello** / [look up] (pause) world.'),'Hello world.');
console.log('Import checks passed: paragraphs, bilingual headings, UTF-8, mixed-language rejection, speech chunks and stage cues.');

