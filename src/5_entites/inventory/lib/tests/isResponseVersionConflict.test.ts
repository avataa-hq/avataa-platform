import { describe, it, expect } from 'vitest';
import { isResponseVersionConflict } from '../isResponseVersionConflict';

describe('isResponseVersionConflict', () => {
  it('should return true if response has status 422 and detail includes "last version"', () => {
    const res = {
      status: 422,
      data: {
        detail: 'Error: last version conflict',
      },
    };

    expect(isResponseVersionConflict(res)).toBe(true);
  });

  it('should return false if status is not 422', () => {
    const res = {
      status: 404,
      data: {
        detail: 'Error: last version conflict',
      },
    };

    expect(isResponseVersionConflict(res)).toBe(false);
  });

  it('should return false if detail does not include "last version"', () => {
    const res = {
      status: 422,
      data: {
        detail: 'Error: some other issue',
      },
    };

    expect(isResponseVersionConflict(res)).toBe(false);
  });

  it('should return false if status is missing', () => {
    const res = {
      data: {
        detail: 'Error: last version conflict',
      },
    };

    expect(isResponseVersionConflict(res)).toBe(false);
  });

  it('should return false if detail is missing', () => {
    const res = {
      status: 422,
      data: {},
    };

    expect(isResponseVersionConflict(res)).toBe(false);
  });

  it('should return false if response is null', () => {
    const res = null;
    expect(isResponseVersionConflict(res)).toBe(false);
  });

  it('should return false if response is undefined', () => {
    const res = undefined;
    expect(isResponseVersionConflict(res)).toBe(false);
  });

  it('should return false if response is an empty object', () => {
    const res = {};
    expect(isResponseVersionConflict(res)).toBe(false);
  });
});
