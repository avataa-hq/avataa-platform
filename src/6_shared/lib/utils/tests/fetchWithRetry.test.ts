import { describe, it, vi, expect, afterEach } from 'vitest';
import { fetchWithRetry } from '../fetchWithRetry';

describe('fetchWithRetry', () => {
  const mockRequestFunction = vi.fn();
  const data = { key: 'value' };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully fetch data without retries', async () => {
    mockRequestFunction.mockResolvedValueOnce('success');
    const result = await fetchWithRetry(mockRequestFunction, data);
    expect(result).toBe('success');
    expect(mockRequestFunction).toHaveBeenCalledTimes(1);
    expect(mockRequestFunction).toHaveBeenCalledWith(data, expect.any(AbortSignal));
  });

  it('should retry the specified number of times on timeout and ultimately succeed', async () => {
    mockRequestFunction.mockRejectedValueOnce({ error: 'AbortError' });
    mockRequestFunction.mockResolvedValueOnce('success after retry');

    const result = await fetchWithRetry(mockRequestFunction, data, {
      maxRetries: 1,
      retryDelay: 50,
    });

    expect(result).toBe('success after retry');
    expect(mockRequestFunction).toHaveBeenCalledTimes(2);
  });

  it('should retry the specified number of times on timeout and ultimately fail', async () => {
    mockRequestFunction.mockRejectedValue({ error: 'AbortError' });
    const maxRetries = 2;
    try {
      const resultPromise = fetchWithRetry(mockRequestFunction, data, {
        retryDelay: 1000,
        timeout: 500,
        maxRetries,
      });

      await resultPromise;
    } catch (error) {
      expect(mockRequestFunction).toHaveBeenCalledTimes(maxRetries + 1);
      expect(error.message).toBe('Error while making request');
    }
  });

  it('should throw an error if all retries are exhausted', async () => {
    mockRequestFunction.mockRejectedValue({ error: 'AbortError' });
    await expect(
      fetchWithRetry(mockRequestFunction, data, { maxRetries: 2, retryDelay: 10 }),
    ).rejects.toThrow('Error while making request');
    expect(mockRequestFunction).toHaveBeenCalledTimes(3); // 1 initial call + 2 retries
  });

  it('should handle timeout by aborting and retrying', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    mockRequestFunction.mockRejectedValueOnce({ error: 'AbortError' });
    mockRequestFunction.mockResolvedValueOnce('success after abort retry');

    const result = await fetchWithRetry(mockRequestFunction, data, {
      timeout: 10,
      retryDelay: 10,
      maxRetries: 1,
    });

    expect(result).toBe('success after abort retry');
    expect(mockRequestFunction).toHaveBeenCalledTimes(2);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(3);
  });

  it('should clear timeout after successful fetch', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    mockRequestFunction.mockResolvedValue('fetch success');

    const result = await fetchWithRetry(mockRequestFunction, data, { timeout: 10 });

    expect(result).toBe('fetch success');
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
