import { describe, expect, it, vi } from 'vitest';
import { INestedFilterForwardRef } from '6_shared';
import { isValidFilterFormState } from '../isValidFilterFormState';

describe('isValidFilterFormState', () => {
  it('should return true if filterRef is null', () => {
    const result = isValidFilterFormState(null);
    expect(result).toBe(true);
  });

  it('should call onApply and return true if getFormState returns isValid as true', () => {
    const mockOnApply = vi.fn();
    const filterRef = {
      onApply: mockOnApply,
      getFormState: () => ({ isValid: true }),
    };

    const result = isValidFilterFormState(filterRef as unknown as INestedFilterForwardRef);
    expect(mockOnApply).toHaveBeenCalled();
    expect(mockOnApply).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('should call onApply and return false if getFormState returns isValid as false', () => {
    const mockOnApply = vi.fn();
    const filterRef = {
      onApply: mockOnApply,
      getFormState: () => ({ isValid: false }),
    };

    const result = isValidFilterFormState(filterRef as unknown as INestedFilterForwardRef);
    expect(mockOnApply).toHaveBeenCalled();
    expect(mockOnApply).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('should call onApply and return true if getFormState is undefined', () => {
    const mockOnApply = vi.fn();
    const filterRef = {
      onApply: mockOnApply,
      getFormState: undefined,
    };

    const result = isValidFilterFormState(filterRef as unknown as INestedFilterForwardRef);
    expect(mockOnApply).toHaveBeenCalled();
    expect(mockOnApply).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('should not call onApply if onApply is undefined and return true if getFormState returns isValid as true', () => {
    const mockOnApply = vi.fn();
    const filterRef = {
      onApply: undefined,
      getFormState: () => ({ isValid: true }),
    };

    const result = isValidFilterFormState(filterRef as unknown as INestedFilterForwardRef);
    expect(mockOnApply).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should not call onApply if onApply is undefined and return true if getFormState returns isValid as false', () => {
    const mockOnApply = vi.fn();
    const filterRef = {
      onApply: undefined,
      getFormState: () => ({ isValid: false }),
    };

    const result = isValidFilterFormState(filterRef as unknown as INestedFilterForwardRef);
    expect(mockOnApply).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should not call onApply if onApply is undefined and return true if getFormState is undefined', () => {
    const mockOnApply = vi.fn();
    const filterRef = {
      onApply: undefined,
      getFormState: undefined,
    };

    const result = isValidFilterFormState(filterRef as unknown as INestedFilterForwardRef);
    expect(mockOnApply).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
