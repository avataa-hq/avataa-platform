import { describe, it, expect } from 'vitest';
import { isValidModelLink } from '../isValidModelLink';

describe('isValidModelLink', () => {
  it('should return true for a supported file extension (.obj)', () => {
    const link = 'https://example.com/model.obj';
    expect(isValidModelLink(link)).toBe(true);
  });

  it('should return true for a supported file extension (.fbx)', () => {
    const link = 'https://example.com/model.fbx';
    expect(isValidModelLink(link)).toBe(true);
  });

  it('should return true for a supported file extension (.glb)', () => {
    const link = 'https://example.com/model.glb';
    expect(isValidModelLink(link)).toBe(true);
  });

  it('should return false for an unsupported file extension (.png)', () => {
    const link = 'https://example.com/model.png';
    expect(isValidModelLink(link)).toBe(false);
  });

  it('should return false for a link with no file extension', () => {
    const link = 'https://example.com/model';
    expect(isValidModelLink(link)).toBe(false);
  });

  it('should return false for an empty link', () => {
    const link = '';
    expect(isValidModelLink(link)).toBe(false);
  });

  it('should be case-insensitive and return true for uppercase extensions', () => {
    const link = 'https://example.com/model.OBJ';
    expect(isValidModelLink(link)).toBe(true);
  });

  it('should handle links with multiple periods correctly and return true if last extension is supported', () => {
    const link = 'https://example.com/path.to/model.glb';
    expect(isValidModelLink(link)).toBe(true);
  });
});
