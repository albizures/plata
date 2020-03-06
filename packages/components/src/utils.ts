const flat = <T>(items: (T[] | T)[] | T): T[] => {
	const seed: T[] = [];

	if (!Array.isArray(items)) {
		return [items];
	}

	return items.reduce<T[]>((list, current) => {
		return list.concat(current);
	}, seed);
};

export { flat };
