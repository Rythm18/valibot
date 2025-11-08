import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { iban, type IbanIssue } from './iban.ts';

describe('iban', () => {
  describe('should accept valid IBANs', () => {
    const action = iban();

    test('from various countries', () => {
      expectNoActionIssue(action, [
        // Germany
        'DE89370400440532013000',
        'DE44500105175407324931',
        // United Kingdom
        'GB82WEST12345698765432',
        'GB33BUKB20201555555555',
        // France
        'FR1420041010050500013M02606',
        'FR7630006000011234567890189',
        // Spain
        'ES9121000418450200051332',
        'ES7921000813610123456789',
        // Italy
        'IT60X0542811101000000123456',
        // Netherlands
        'NL91ABNA0417164300',
        'NL39RABO0300065264',
        // Belgium
        'BE68539007547034',
        'BE71096123456769',
        // Switzerland
        'CH9300762011623852957',
        'CH5604835012345678009',
      ]);
    });

    test('with spaces', () => {
      expectNoActionIssue(action, [
        'DE89 3704 0044 0532 0130 00',
        'GB82 WEST 1234 5698 7654 32',
        'FR14 2004 1010 0505 0001 3M02 606',
        'ES91 2100 0418 4502 0005 1332',
        'NL91 ABNA 0417 1643 00',
        'BE68 5390 0754 7034',
      ]);
    });

    test('with mixed spacing', () => {
      expectNoActionIssue(action, [
        'DE89 37040044 0532013000',
        'GB82WEST 1234 56987654 32',
        'NL91 ABNA0417164300',
      ]);
    });
  });

  describe('should reject invalid IBANs', () => {
    const action = iban('Invalid IBAN');
    const baseIssue: Omit<IbanIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'iban',
      expected: null,
      message: 'Invalid IBAN',
      requirement: expect.any(Function),
    };

    test('with empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('with invalid checksum', () => {
      expectActionIssue(action, baseIssue, [
          'DE89370400440532013001', // Last digit changed
          'GB82WEST12345698765433', // Last digit changed
          'FR1420041010050500013M02607', // Last digit changed
          'ES9121000418450200051333', // Last digit changed
        ]
      );
    });

    test('with invalid country code', () => {
      expectActionIssue(action, baseIssue, [
          'ZZ89370400440532013000', // Invalid country
          'A189370400440532013000', // Single letter
          '1289370400440532013000', // Starts with digit
          'D989370400440532013000', // Single letter
        ]
      );
    });

    test('with invalid check digits', () => {
      expectActionIssue(action, baseIssue, [
          'DEAA370400440532013000', // Letters instead of digits
          'DE1A370400440532013000', // Letter in check digits
          'DEXX370400440532013000', // Invalid check digits
        ]
      );
    });

    test('that are too short', () => {
      expectActionIssue(action, baseIssue, [
          'DE8937040044053', // Too short
          'GB82WEST1234', // Too short
          'FR142004', // Too short
        ]
      );
    });

    test('that are too long', () => {
      expectActionIssue(action, baseIssue, ['DE893704004405320130001234567890123'] // Too long (>34 chars)
      );
    });

    test('with invalid characters', () => {
      expectActionIssue(action, baseIssue, [
          'DE89@70400440532013000', // Special character
          'DE89 3704-0044-0532-0130-00', // Hyphens
          'DE89_3704_0044_0532_0130_00', // Underscores
          'GB82WEST12345698765432!', // Exclamation mark
        ]
      );
    });

    test('with lowercase letters', () => {
      expectActionIssue(action, baseIssue, [
          'de89370400440532013000',
          'gb82west12345698765432',
          'fr1420041010050500013m02606',
        ]
      );
    });

    test('with completely invalid format', () => {
      expectActionIssue(action, baseIssue, [
          'not-an-iban',
          '123456789',
          'ABCDEFGH',
          'random string',
        ]
      );
    });
  });
});
