import { assertEquals } from 'https://deno.land/std@0.198.0/testing/asserts.ts';
import { validateTaskPayload } from './tasks.ts';

Deno.test('validateTaskPayload accepts persisted naming answers object from client', () => {
  assertEquals(validateTaskPayload('moca-naming', { answers: { lion: 'אריה', rhino: 'קרנף', camel: 'גמל' } }), null);
});

Deno.test('validateTaskPayload rejects incomplete persisted naming answers object', () => {
  assertEquals(
    validateTaskPayload('moca-naming', { answers: { lion: 'אריה', rhino: 'קרנף' } }),
    'Naming rawData must be an array of 3 answers or an answers object',
  );
});
