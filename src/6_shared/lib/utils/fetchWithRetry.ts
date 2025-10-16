interface FetchWithRetryOptions {
  retryDelay?: number;
  timeout?: number;
  maxRetries?: number;
}

export const fetchWithRetry = async <T, R>(
  requestFunction: (data: T, signal?: AbortSignal) => Promise<R>,
  data: T,
  options: FetchWithRetryOptions = {},
): Promise<R> => {
  const { retryDelay = 500, timeout = 5000, maxRetries = 1 } = options;
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await requestFunction(data, signal);
    return response;
  } catch (error) {
    if (error.error?.includes('AbortError') && maxRetries > 0) {
      console.warn('Request timed out, retrying...');

      await new Promise((resolve) => {
        setTimeout(resolve, retryDelay);
      });
      return await fetchWithRetry(requestFunction, data, {
        retryDelay,
        timeout,
        maxRetries: maxRetries - 1,
      });
    }
    throw error;
    // throw new Error('Error while making request');
  } finally {
    clearTimeout(timeoutId);
  }
};
