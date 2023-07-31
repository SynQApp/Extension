export const findIndexes = <T>(arr: T[], predicate: (item: T) => boolean) => {
  return arr.reduce((acc, item, index) => {
    if (predicate(item)) {
      acc.push(index);
    }

    return acc;
  }, [] as number[]);
};
