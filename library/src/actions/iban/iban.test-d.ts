import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { iban, type IbanAction, type IbanIssue } from './iban.ts';

describe('iban', () => {
  test('should accept string input', () => {
    expectTypeOf<InferInput<IbanAction<string, undefined>>>().toEqualTypeOf<string>();
  });

  test('should return string output', () => {
    expectTypeOf<InferOutput<IbanAction<string, undefined>>>().toEqualTypeOf<string>();
  });

  test('should infer correct issue type', () => {
    expectTypeOf<InferIssue<IbanAction<string, undefined>>>().toEqualTypeOf<IbanIssue<string>>();
  });
});
