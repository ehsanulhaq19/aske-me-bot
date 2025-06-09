type AnyFunction = (...args: any[]) => any;

interface DebouncedFunction<T extends AnyFunction> {
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel: () => void;
}

export function debounce<T extends AnyFunction>(
  func: T,
  waitMs: number = 0
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let currentPromise: Promise<ReturnType<T>> | undefined;
  let lastResolve: ((value: ReturnType<T>) => void) | undefined;

  const debouncedFn = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!currentPromise || !lastResolve) {
      currentPromise = new Promise((resolve) => {
        lastResolve = resolve;
      });
    }

    timeoutId = setTimeout(async () => {
      try {
        const result = await func(...args);
        if (lastResolve) {
          lastResolve(result);
          lastResolve = undefined;
        }
      } catch (error) {
        console.error('Debounced function error:', error);
        throw error;
      } finally {
        timeoutId = undefined;
      }
    }, waitMs);

    return currentPromise;
  };

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    lastResolve = undefined;
    currentPromise = undefined;
  };

  return debouncedFn;
} 