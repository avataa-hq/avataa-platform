export const extractModelPath = (url: string) => {
  try {
    const urlObject = new URL(url);
    return urlObject.origin + urlObject.pathname;
  } catch (error) {
    throw new Error('Invalid URL format');
  }
};
