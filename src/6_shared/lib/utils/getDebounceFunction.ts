export const getDebounceFunction = (func: (...args: any[]) => any, delay: number) => {
  let timeoutId: NodeJS.Timer;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
