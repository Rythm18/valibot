import { IBAN_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * IBAN issue type.
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
   * The IBAN requirement.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * IBAN action type.
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
   * The IBAN requirement.
   */
  readonly requirement: (input: string) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
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
    requirement(input) {
      // Check basic format with regex
      if (!IBAN_REGEX.test(input)) {
        return false;
      }

      // Validate IBAN using mod-97 checksum algorithm
      // Move first 4 characters to end
      const rearranged = input.slice(4) + input.slice(0, 4);

      // Replace letters with numbers (A=10, B=11, ..., Z=35)
      const numericString = rearranged
        .split('')
        .map((char) => {
          const code = char.charCodeAt(0);
          // A-Z: 65-90 -> 10-35
          if (code >= 65 && code <= 90) {
            return code - 55;
          }
          // 0-9: return as is
          return char;
        })
        .join('');

      // Calculate mod 97
      let remainder = numericString;
      while (remainder.length > 2) {
        const block = remainder.slice(0, 9);
        remainder = (parseInt(block, 10) % 97) + remainder.slice(block.length);
      }

      return parseInt(remainder, 10) % 97 === 1;
    },
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'IBAN', dataset, config);
      }
      return dataset;
    },
  };
}
