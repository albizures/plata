const toArray = <T>(item: T | T[]): T[] => ([] as T[]).concat(item);

export { toArray };
