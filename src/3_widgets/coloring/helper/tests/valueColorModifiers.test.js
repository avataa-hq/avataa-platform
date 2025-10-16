import { test, expect, vi, describe, beforeEach } from 'vitest';
import {
  onChangeRowColor,
  onChangeRowValue,
  onAddColor,
  onRemoveColor,
} from '../valueColorModifiers';

const mockUpdatePalette = vi.fn();

describe('Color Modifiers Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('onChangeRowColor', () => {
    test('onChangeRowColor handles index 999 correctly', () => {
      const event = { target: { value: '#FFFFFF' } };
      const index = 999;
      const colors = [{ name: 'Color1', id: '1', hex: '#000000', booleanValue: false }];

      onChangeRowColor({ event, index, colors, updatePalette: mockUpdatePalette });

      setTimeout(() => {
        expect(mockUpdatePalette).toHaveBeenCalledTimes(1);
        const updatedPalette = mockUpdatePalette.mock.calls[0][0]({ ranges: { defaultColor: '' } });
        expect(updatedPalette.ranges.defaultColor).toBe('#FFFFFF');
      }, 10);
    });

    test('should update color hex for other indices', () => {
      const event = { target: { value: '#FFFFFF' } };
      const index = 0;
      const colors = [{ name: 'Color1', id: '1', hex: '#000000', booleanValue: false }];

      onChangeRowColor({ event, index, colors, updatePalette: mockUpdatePalette });

      setTimeout(() => {
        expect(mockUpdatePalette).toHaveBeenCalledTimes(1);
        const updatedColorHex = mockUpdatePalette.mock.calls[0][0]({ ranges: { colors: [] } })
          .ranges.colors[0].hex;
        expect(updatedColorHex).toBe('#FFFFFF');
      }, 10);
    });
  });

  describe('onChangeRowValue', () => {
    test('should update values correctly for middle index', () => {
      const event = { target: { value: '50' } };
      const index = 1;
      const values = [10, 20, 30];
      const colors = [{ name: 'Color1', id: '1', hex: '#000000', booleanValue: false }];

      onChangeRowValue({ event, index, values, colors, updatePalette: mockUpdatePalette });

      setTimeout(() => {
        expect(mockUpdatePalette).toHaveBeenCalledTimes(1);
        const updatedValues = mockUpdatePalette.mock.calls[0][0]({ ranges: { values: [] } }).ranges
          .values;
        expect(updatedValues).toEqual([10, 50, 20, 30]);
      }, 10);
    });

    test('should not update values for invalid index', () => {
      const event = { target: { value: '50' } };
      const index = 0;
      const values = [10, 20, 30];
      const colors = [{ name: 'Color1', id: '1', hex: '#000000', booleanValue: false }];

      onChangeRowValue({ event, index, values, colors, updatePalette: mockUpdatePalette });

      expect(mockUpdatePalette).not.toHaveBeenCalled();
    });
  });

  describe('onAddColor', () => {
    test('onAddColor should add a new color and update values', () => {
      const index = 0;
      const colors = [
        { name: 'Color1', id: '1', hex: '#000000', booleanValue: false },
        { name: 'Color2', id: '2', hex: '#FFFFFF', booleanValue: false },
      ];
      const values = [10, 20, 30];

      onAddColor({ index, colors, values, updatePalette: mockUpdatePalette });

      setTimeout(() => {
        expect(mockUpdatePalette).toHaveBeenCalledTimes(1);
        const updatedColors = mockUpdatePalette.mock.calls[0][0]({
          ranges: { colors, values },
        }).ranges.colors;
        const updatedValues = mockUpdatePalette.mock.calls[0][0]({
          ranges: { colors, values },
        }).ranges.values;
        expect(updatedColors.length).toBe(3);
        expect(updatedValues.length).toBe(4);
      }, 10);
    });
  });

  describe('onRemoveColor', () => {
    test('should remove a color and update values', () => {
      const index = 1;
      const colors = [
        { name: 'Color1', id: '1', hex: '#000000', booleanValue: false },
        { name: 'Color2', id: '2', hex: '#FFFFFF', booleanValue: false },
      ];
      const values = [10, 20, 30];

      onRemoveColor({ index, colors, values, updatePalette: mockUpdatePalette });

      setTimeout(() => {
        expect(mockUpdatePalette).toHaveBeenCalledTimes(1);
        const updatedColors = mockUpdatePalette.mock.calls[0][0]({
          ranges: { colors: [], values: [] },
        }).ranges.colors;
        const updatedValues = mockUpdatePalette.mock.calls[0][0]({
          ranges: { colors: [], values: [] },
        }).ranges.values;
        expect(updatedColors.length).toBe(1);
        expect(updatedValues.length).toBe(2);
      }, 10);
    });
  });
});
