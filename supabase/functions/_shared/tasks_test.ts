import { parseAudioDataUrl, validateTaskPayload } from './tasks.ts';

function assertEquals(actual: unknown, expected: unknown) {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

Deno.test('validateTaskPayload accepts persisted naming answers object from client', () => {
  assertEquals(validateTaskPayload('moca-naming', { answers: { 'item-1': 'סוס', 'item-2': 'נמר', 'item-3': 'ברווז' } }), null);
});

Deno.test('validateTaskPayload accepts legacy naming answers object', () => {
  assertEquals(validateTaskPayload('moca-naming', { answers: { lion: 'אריה', rhino: 'קרנף', camel: 'גמל' } }), null);
});

Deno.test('validateTaskPayload rejects incomplete persisted naming answers object', () => {
  assertEquals(
    validateTaskPayload('moca-naming', { answers: { lion: 'אריה', rhino: 'קרנף' } }),
    'Naming rawData must be an array of 3 answers or an answers object',
  );
});

Deno.test('validateTaskPayload rejects non-string naming answer values', () => {
  assertEquals(
    validateTaskPayload('moca-naming', { answers: { lion: 'אריה', rhino: null, camel: 'גמל' } }),
    'Naming rawData must be an array of 3 answers or an answers object',
  );
});

Deno.test('parseAudioDataUrl accepts Safari audio data URLs with codec parameters', () => {
  const parsed = parseAudioDataUrl('data:audio/mp4;codecs=mp4a.40.2;base64,QUJD', 'audio/mp4;codecs=mp4a.40.2');
  assertEquals(parsed?.contentType, 'audio/mp4');
  assertEquals(parsed?.base64Data, 'QUJD');
});

Deno.test('parseAudioDataUrl uses data URL content type when it differs from fallback', () => {
  const parsed = parseAudioDataUrl('data:audio/webm;codecs=opus;base64,QUJD', 'audio/mp4');
  assertEquals(parsed?.contentType, 'audio/webm');
  assertEquals(parsed?.base64Data, 'QUJD');
});

Deno.test('parseAudioDataUrl rejects non-base64 audio data URLs', () => {
  assertEquals(parseAudioDataUrl('data:audio/mp4,abc', 'audio/mp4'), null);
});
