import { describe, it, expect, vi } from 'vitest';
import { formatSummaryText } from '../formatSummaryText';

describe('formatSummaryText', () => {
  it('should format bold text correctly', () => {
    const result = formatSummaryText('This is **bold** text.');
    expect(result).toBe('This is <span><strong>bold</strong></span> text.');
  });

  it('should format italic text correctly', () => {
    const result = formatSummaryText('This is *italic* text.');
    expect(result).toBe('This is <em>italic</em> text.');
  });

  it('should format a list with a bullet point correctly', () => {
    const result = formatSummaryText('This is a list:\n* Item 1\n* Item 2\n* Item 3');
    expect(result).toBe('This is a list:\n• Item 1\n• Item 2\n• Item 3');
  });

  it('should handle text with both bold and italic formatting', () => {
    const result = formatSummaryText('This is **bold** and *italic* text.');
    expect(result).toBe('This is <span><strong>bold</strong></span> and <em>italic</em> text.');
  });

  it('should handle complex formatting with multiple styles', () => {
    const result = formatSummaryText(
      '* List item\n Another item with **bold** text and *italic* text',
    );
    expect(result).toBe(
      '• List item\n Another item with <span><strong>bold</strong></span> text and <em>italic</em> text',
    );
  });

  it('should handle empty input', () => {
    const result = formatSummaryText('');
    expect(result).toBe('');
  });

  it('should return original input if there is a formatting error', () => {
    const invalidInput = null as any;
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = formatSummaryText(invalidInput);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error formatting text:'),
      expect.any(TypeError),
    );

    expect(result).toBe(invalidInput);

    consoleSpy.mockRestore();
  });

  it('should return original input if value is "[object Object]"', () => {
    const result = formatSummaryText('[object Object]');
    expect(result).toBe('[object Object]');
  });
});
