import { describe, it, expect, vi } from 'vitest';
import { handleMouseRowEnter, handleMouseRowLeave } from '../mouseHandlers';

describe('handleMouseRowEnter', () => {
  it('should set the hovered state to true at the specified index', () => {
    const setHoveredRow = vi.fn();
    const index = 2;
    const prevState = [false, false, false, false, false];

    handleMouseRowEnter({ setHoveredRow, index });

    expect(setHoveredRow).toHaveBeenCalledWith(expect.any(Function));

    const setStateCallback = setHoveredRow.mock.calls[0][0];
    const newState = setStateCallback(prevState);

    expect(newState).toEqual([false, false, true, false, false]);
  });

  it('should handle an empty state array', () => {
    const setHoveredRow = vi.fn();
    const index = 2;
    const prevState = [];

    handleMouseRowEnter({ setHoveredRow, index });

    expect(setHoveredRow).toHaveBeenCalledWith(expect.any(Function));

    const setStateCallback = setHoveredRow.mock.calls[0][0];
    const newState = setStateCallback(prevState);

    expect(newState).toEqual([undefined, undefined, true]);
  });

  it('should handle an index out of bounds', () => {
    const setHoveredRow = vi.fn();
    const index = 10;
    const prevState = [false, false, false];

    handleMouseRowEnter({ setHoveredRow, index });

    expect(setHoveredRow).toHaveBeenCalledWith(expect.any(Function));

    const setStateCallback = setHoveredRow.mock.calls[0][0];
    const newState = setStateCallback(prevState);

    const expectedState = [false, false, false];
    expectedState[index] = true;
    expect(newState).toEqual(expectedState);
  });

  it('should not change state if it is already true', () => {
    const setHoveredRow = vi.fn();
    const index = 2;
    const prevState = [false, false, true, false, false];

    handleMouseRowEnter({ setHoveredRow, index });

    expect(setHoveredRow).toHaveBeenCalledWith(expect.any(Function));

    const setStateCallback = setHoveredRow.mock.calls[0][0];
    const newState = setStateCallback(prevState);

    expect(newState).toEqual(prevState);
  });
});

describe('handleMouseRowLeave', () => {
  it('should set the hovered state to false at the specified index', () => {
    const setHoveredRow = vi.fn();
    const index = 2;
    const prevState = [false, false, true, false, false];

    handleMouseRowLeave({ setHoveredRow, index });

    expect(setHoveredRow).toHaveBeenCalledWith(expect.any(Function));

    const setStateCallback = setHoveredRow.mock.calls[0][0];
    const newState = setStateCallback(prevState);

    expect(newState).toEqual([false, false, false, false, false]);
  });

  it('should handle an empty state array', () => {
    const setHoveredRow = vi.fn();
    const index = 2;
    const prevState = [];

    handleMouseRowLeave({ setHoveredRow, index });

    expect(setHoveredRow).toHaveBeenCalledWith(expect.any(Function));

    const setStateCallback = setHoveredRow.mock.calls[0][0];
    const newState = setStateCallback(prevState);

    expect(newState).toEqual([undefined, undefined, false]);
  });

  it('should handle an index out of bounds', () => {
    const setHoveredRow = vi.fn();
    const index = 10;
    const prevState = [false, false, true];

    handleMouseRowLeave({ setHoveredRow, index });

    expect(setHoveredRow).toHaveBeenCalledWith(expect.any(Function));

    const setStateCallback = setHoveredRow.mock.calls[0][0];
    const newState = setStateCallback(prevState);

    const expectedState = [false, false, true];
    expectedState[index] = false;
    expect(newState).toEqual(expectedState);
  });

  it('should not change state if it is already false', () => {
    const setHoveredRow = vi.fn();
    const index = 2;
    const prevState = [false, false, false, false, false];

    handleMouseRowLeave({ setHoveredRow, index });

    expect(setHoveredRow).toHaveBeenCalledWith(expect.any(Function));

    const setStateCallback = setHoveredRow.mock.calls[0][0];
    const newState = setStateCallback(prevState);

    expect(newState).toEqual(prevState);
  });
});
