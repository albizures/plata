import {
	Component,
	Ref,
	OnReady,
	Styles,
	ElementNames,
	Attributes,
	EventHandler,
	Plugin,
	CustomSupportedType,
	PlataElement,
	Child,
	FlattedChild,
	SimpleChild,
} from './types';
import { flat } from './utils';

const plugins: Plugin[] = [];

const customSupportedTypes: CustomSupportedType<any>[] = [];

const initRef = <E extends ElementNames>(
	element: HTMLElementTagNameMap[E],
	props: Attributes<HTMLElementTagNameMap[E]>,
) => {
	if (!props || !props.ref) {
		return;
	}

	props.ref.current = element;
};

const create = async <E extends ElementNames, C extends Component>(
	name: E | C,
	props: Attributes<HTMLElementTagNameMap[E]> | Parameters<C>[0],
	...children: Child[]
): PlataElement => {
	if (typeof name === 'function') {
		const result = name({
			...props,
			children,
		});
		return result;
	}

	const attr = props as Attributes<HTMLElementTagNameMap[E]>;

	const element = document.createElement(name);

	const resolvedChildren = await Promise.all<FlattedChild | Node[]>(children);

	const flattedChildren = flat<FlattedChild>(resolvedChildren);

	await appendChildren(element, flattedChildren);
	initRef(element, attr);

	plugins.forEach((plugin) => {
		// TODO: catch any error and throw and custom error
		plugin(element, attr);
	});

	Object.assign(element, props);

	return element;
};

const render = (element: PlataElement, parent: HTMLElement) => {
	const ref = createRef<HTMLElement>();
	ref.current = parent;
	return append(ref, element);
};

const childToNodes = async (
	items: Child | Node[] | null,
	parent: HTMLElement,
	nullAsNode = false,
): Promise<Node[]> => {
	const child = await items;
	if (Array.isArray(child)) {
		const nodesList = await Promise.all(
			child.map((current) => {
				return childToNodes(current, parent);
			}),
		);

		return nodesList.reduce((list, currentList) => {
			return list.concat(currentList);
		});
	}

	for (let index = 0; index < customSupportedTypes.length; index++) {
		const element = customSupportedTypes[index];
		if (element.checkType(child)) {
			return element.parser(child, parent);
		}
	}

	if (child instanceof Node) {
		return [child];
	} else if (typeof child === 'string') {
		return [document.createTextNode(child)];
	} else if (nullAsNode && child === null) {
		return [document.createTextNode('')];
	} else if (child && typeof child !== 'boolean') {
		return [document.createTextNode(String(child))];
	}

	return [];
};

const appendComplexChild = async (element: HTMLElement, child: Child) => {
	const nodes = await childToNodes(child, element);

	for (let index = 0; index < nodes.length; index++) {
		element.append(nodes[index]);
	}
};

const appendChildren = (element: HTMLElement, children: FlattedChild[]) => {
	return Promise.all(
		children.map((child) => {
			return appendComplexChild(element, child);
		}),
	);
};

const onReady = <T>(ref: Ref<T>, handler: OnReady) => {
	ref.handlers.push(handler);
};

const on = <T extends HTMLElement>(
	ref: Ref<T>,
	eventName: string,
	handler: EventHandler<T>,
) => {
	if (ref.current) {
		ref.current.addEventListener(eventName, handler as EventListener);
	} else {
		onReady(ref, () => on(ref, eventName, handler));
	}
};

const off = <T extends HTMLElement>(
	ref: Ref<T>,
	eventName: string,
	handler: EventHandler<T>,
) => {
	if (ref.current) {
		ref.current.removeEventListener(eventName, handler as EventListener);
	} else {
		onReady(ref, () => on(ref, eventName, handler));
	}
};

const setStyles = <T extends HTMLElement>(ref: Ref<T>, styles: Styles) => {
	if (ref.current) {
		Object.assign(ref.current.style, styles);
	} else {
		onReady(ref, () => setStyles(ref, styles));
	}
};

const append = async <T extends HTMLElement>(
	ref: Ref<T>,
	children: PlataElement,
) => {
	if (ref.current) {
		appendChildren(ref.current, flat(await children));
	} else {
		onReady(ref, () => append(ref, children));
	}
};

const remove = <T extends HTMLElement>(ref: Ref<T>) => {
	if (ref.current) {
		ref.current.remove();
	} else {
		onReady(ref, () => remove(ref));
	}
};

const replaceContent = async <T extends HTMLElement>(
	ref: Ref<T>,
	children: PlataElement | SimpleChild,
) => {
	if (ref.current) {
		ref.current.innerHTML = '';
		appendChildren(ref.current, flat(await children));
	} else {
		onReady(ref, () => replaceContent(ref, children));
	}
};

const createRef = <T>(): Ref<T> => {
	const handlers: OnReady[] = [];
	let value: T;

	const ref = {
		handlers,
		set current(newValue: T) {
			if (!value) {
				value = newValue;
				handlers.forEach((handler) => {
					// TODO: catch any error and throw and custom error
					handler(value);
				});

				handlers.length = 0;
			} else {
				value = newValue;
			}
		},
		get current() {
			return value;
		},
	};

	return ref;
};

export {
	childToNodes,
	customSupportedTypes,
	plugins,
	render,
	replaceContent,
	onReady,
	remove,
	setStyles,
	create,
	createRef,
	append,
	on,
	off,
};
