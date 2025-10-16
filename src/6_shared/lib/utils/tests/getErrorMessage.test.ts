import { it, describe, expect } from 'vitest';

import { getErrorMessage } from '../getErrorMessage';

describe('getErrorMessage', () => {
  it('should return the detail message from error.data', () => {
    const error = {
      data: {
        detail: 'This is a detailed error message',
      },
    };
    const result = getErrorMessage(error);

    expect(result).toBe('This is a detailed error message');
  });

  it('should return the error message from error.error', () => {
    const error = {
      error: 'An error occured',
    };
    const result = getErrorMessage(error);

    expect(result).toBe('An error occured');
  });

  it('should return the message from error.message', () => {
    const error = {
      message: 'Another error message',
    };
    const result = getErrorMessage(error);

    expect(result).toBe('Another error message');
  });

  it('should return a default message for unknown error structure', () => {
    const error = {
      unknownProperty: 'Unknown error',
    };
    const result = getErrorMessage(error);

    expect(result).toBe('An error occured');
  });

  it('should handle empty error object', () => {
    const error = {};
    const result = getErrorMessage(error);

    expect(result).toBe('An error occured');
  });
});
