const debounceMap = new Map<string, NodeJS.Timeout>();

export const debounce = (fn: Function, key: string, delay: number) => {
  if (debounceMap.has(key)) {
    clearTimeout(debounceMap.get(key)!);
  }

  debounceMap.set(
    key,
    setTimeout(() => {
      fn();
      debounceMap.delete(key);
    }, delay)
  );
};
