import {
	Child,
	Children,
	Component,
	Ref,
	OnReady,
	Styles,
	ElementNames,
	Attributes,
	EventHandler,
	Plugin,
} from './types';

export const plugins: Plugin[] = [];

const initRef = <E extends ElementNames>(
	element: HTMLElementTagNameMap[E],
	props: Attributes<HTMLElementTagNameMap[E]>,
) => {
	if (!props || !props.ref) {
		return;
	}

	props.ref.current = element;
};

const create = <E extends ElementNames, C extends Component>(
	name: E | C,
	props: Attributes<HTMLElementTagNameMap[E]> | Parameters<C>[0],
	...children: Child[]
): HTMLElement => {
	if (typeof name === 'function') {
		return name({
			...props,
			children,
		});
	}

	const attr = props as Attributes<HTMLElementTagNameMap[E]>;

	const element = document.createElement(name);

	appendChild(element, children);
	initRef(element, attr);

	console.log(plugins);

	plugins.forEach((plugin) => {
		// TODO: catch any error and throw and custom error
		plugin(element, attr);
	});

	Object.assign(element, props);

	return element;
};

const render = (element: HTMLElement, parent: HTMLElement) => {
	parent.appendChild(element);
};

const appendChild = (element: HTMLElement, children: Children) => {
	if (Array.isArray(children)) {
		children.forEach((child) => {
			appendChild(element, child);
		});
	} else if (children instanceof HTMLElement) {
		element.appendChild(children);
	} else if (typeof children !== 'boolean') {
		element.appendChild(document.createTextNode(String(children)));
	}
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
		appendChild(ref.current, children);
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
		appendChild(ref.current, children);
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
			if (value === null) {
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
	render,
	replaceContent,
	remove,
	setStyles,
	create,
	createRef,
	append,
	on,
	off,
};
