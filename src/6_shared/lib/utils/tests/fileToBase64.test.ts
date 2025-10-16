import { describe, it, expect } from 'vitest';

import { file2Base64 } from '../fileToBase64';

describe('file2Base64', () => {
  it('should resolve with a base64 string for a valid file', async () => {
    const sampleFile = new File(['sample data'], 'sample.txt', { type: 'text/plain' });

    const base64String = await file2Base64(sampleFile);

    expect(base64String.length).toBeGreaterThanOrEqual(1);
  });

  it('should reject when given an invalid file', async () => {
    // Create an invalid file (e.g., null file)
    const invalidFile = null;

    // @ts-ignore - intentionally passing an invalid file
    await expect(file2Base64(invalidFile)).rejects.toThrowError();
  });
});
