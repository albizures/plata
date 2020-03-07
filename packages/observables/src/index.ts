import {
	customSupportedTypes,
	childToNodes,
	ObservableValues,
	flat,
	FallbackError,
} from '@plata/core';
import {
	Observable,
	ObservableWatcher,
	CustomSupportedType,
	ObservableChild,
} from '@plata/core/src/types';

const createObservable = <T>(defaultValue: T | null = null) => {
	let value = defaultValue;
	const handlers: ObservableWatcher<T>[] = [];
	return {
		set value(newValue: T | null) {
			handlers.forEach((handler) => {
				handler(newValue, value);
			});
			value = newValue;
		},
		get value(): T | null {
			return value;
		},
		watch(handler: ObservableWatcher<T>) {
			handlers.push(handler);
		},
	};
};

const isObservable = <T>(observable: unknown): observable is Observable<T> => {
	return (
		observable && typeof (observable as Observable<T>).watch === 'function'
	);
};

const observableValueToNodes = async (
	observable: ObservableValues,
	parent: HTMLElement,
): Promise<Node[]> => {
	if (Array.isArray(observable)) {
		const nodes = await Promise.all(
			flat(observable).map((item) => {
				return childToNodes(item, parent, true);
			}, []),
		);
		return flat(nodes);
	}

	return childToNodes(observable, parent, true);
};

const checkByError = async (
	newValue: ObservableValues,
	parent: HTMLElement,
): Promise<Node[]> => {
	try {
		return await observableValueToNodes(newValue, parent);
	} catch (error) {
		if (error instanceof FallbackError || error.fallback) {
			console.error(error.originalError);

			try {
				return await observableValueToNodes(error.fallback, parent);
			} catch {}
		} else {
			throw error;
		}
	}

	return [];
};

const customType: CustomSupportedType<ObservableChild> = {
	checkType: isObservable,
	parser: async (child: ObservableChild, parent: HTMLElement) => {
		const nodes = await checkByError(child.value, parent);
		let refElement: Node | null;
		let oldNodes: Node[] = nodes;

		child.watch(async (newValue) => {
			const newNodes = await checkByError(newValue, parent);

			oldNodes.forEach((node) => {
				parent.removeChild(node);
			});

			newNodes.reduce((ref, current) => {
				if (ref && ref.parentNode) {
					ref.parentNode.insertBefore(current, ref.nextSibling);
				} else {
					parent.appendChild(current);
				}
				return current;
			}, refElement);

			refElement = newNodes[0].previousSibling;
			oldNodes = newNodes;
		});

		return nodes;
	},
};

customSupportedTypes.push(customType);

export { createObservable, isObservable };
