export const hasDuplicates = (arr1: string[], arr2: string[]): boolean => {
  const set = new Set(arr1);
  return arr2.some((item) => set.has(item));
};