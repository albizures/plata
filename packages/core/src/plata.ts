import {
	Children,
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
	ResolvedChild,
} from './types';
import { toArray } from './utils';

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
	...children: Children[]
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

	await appendChild(element, children);
	initRef(element, attr);

	plugins.forEach((plugin) => {
		// TODO: catch any error and throw and custom error
		plugin(element, attr);
	});

	Object.assign(element, props);

	return element;
};

const render = async (element: PlataElement, parent: HTMLElement) => {
	const ref = createRef<HTMLElement>();
	ref.current = parent;
	append(ref, await element);
};

const childToNodes = async (
	child: ResolvedChild | null,
	parent: HTMLElement,
	nullAsNode = false,
): Promise<Node[]> => {
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

	if (child instanceof HTMLElement) {
		return [child];
	} else if (typeof child === 'string') {
		return [document.createTextNode(child)];
	} else if (child && typeof child !== 'boolean') {
		return [document.createTextNode(String(child))];
	} else if (nullAsNode && child === null) {
		return [document.createTextNode('')];
	}

	return [];
};

const appendComplexChild = async (
	element: HTMLElement,
	children: ResolvedChild | ResolvedChild[],
) => {
	const childList = toArray(children);

	for (let index = 0; index < childList.length; index++) {
		const nodes = await childToNodes(
			childList[index] as ResolvedChild,
			element,
		);
		for (let index = 0; index < nodes.length; index++) {
			element.appendChild(nodes[index]);
		}
	}
};

const appendChild = async (element: HTMLElement, children: Children[]) => {
	await Promise.all(
		children.map(async (child) => {
			return appendComplexChild(element, await child);
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

const append = <T extends HTMLElement>(ref: Ref<T>, children: Children) => {
	if (ref.current) {
		appendChild(ref.current, toArray(children));
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

const replaceContent = <T extends HTMLElement>(
	ref: Ref<T>,
	children: Children,
) => {
	if (ref.current) {
		ref.current.innerHTML = '';
		appendChild(ref.current, toArray(children));
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
