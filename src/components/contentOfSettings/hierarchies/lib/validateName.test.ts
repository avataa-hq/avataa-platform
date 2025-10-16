import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { validateName } from './validateName';

describe('validateName', () => {
  const translate = vi.fn();

  beforeEach(() => {
    translate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a translated error message when name is only spaces', () => {
    translate.mockReturnValueOnce('Name cannot be only spaces');
    const result = validateName('    ', translate);
    expect(result).toBe('Name cannot be only spaces');
    expect(translate).toHaveBeenCalledWith('Name cannot be only spaces');
  });

  it('should return a translated error message when name contains consecutive spaces', () => {
    translate.mockReturnValueOnce('Name cannot contain consecutive spaces');
    const result = validateName('Name    with    consecutive spaces', translate);
    expect(result).toBe('Name cannot contain consecutive spaces');
    expect(translate).toHaveBeenCalledWith('Name cannot contain consecutive spaces');
  });

  it('should return true when name is valid', () => {
    translate.mockReturnValueOnce('');
    const result = validateName('Valid Name', translate);
    expect(result).toBe(true);
    expect(translate).not.toHaveBeenCalled();
  });
});
