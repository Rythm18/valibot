import { IBAN_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * IBAN issue interface.
 */
export interface IbanIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'iban';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * IBAN action interface.
 */
export interface IbanAction<
  TInput extends string,
  TMessage extends ErrorMessage<IbanIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IbanIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'iban';
  /**
   * The action reference.
   */
  readonly reference: typeof iban;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Validates an IBAN using the mod-97 checksum algorithm.
 *
 * @param iban The IBAN to validate.
 *
 * @returns Whether the IBAN is valid.
 */
function validateIbanChecksum(iban: string): boolean {
  // Remove spaces only (keep case to validate later)
  const normalized = iban.replace(/\s/g, '');

  // Check format with regex (requires uppercase)
  if (!IBAN_REGEX.test(normalized)) {
    return false;
  }

  // Move first 4 characters to the end
  const rearranged = normalized.slice(4) + normalized.slice(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged.replace(/[A-Z]/g, (char) =>
    (char.charCodeAt(0) - 55).toString()
  );

  // Calculate mod 97
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i], 10)) % 97;
  }

  return remainder === 1;
}

/**
 * Creates an [IBAN](https://en.wikipedia.org/wiki/International_Bank_Account_Number) validation action.
 *
 * @returns An IBAN action.
 */
export function iban<TInput extends string>(): IbanAction<TInput, undefined>;

/**
 * Creates an [IBAN](https://en.wikipedia.org/wiki/International_Bank_Account_Number) validation action.
 *
 * @param message The error message.
 *
 * @returns An IBAN action.
 */
export function iban<
  TInput extends string,
  const TMessage extends ErrorMessage<IbanIssue<TInput>> | undefined,
>(message: TMessage): IbanAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function iban(
  message?: ErrorMessage<IbanIssue<string>>
): IbanAction<string, ErrorMessage<IbanIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'iban',
    reference: iban,
    async: false,
    expects: null,
    requirement: validateIbanChecksum,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'IBAN', dataset, config);
      }
      return dataset;
    },
  };
}
