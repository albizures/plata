import {
	ElementNames,
	Attributes,
	EventHandlers,
} from '@plata/core/dist/types';
import * as P from '@plata/core';

const addEventHandler = <E extends ElementNames>(
	element: HTMLElement,
	props: EventHandlers<HTMLElementTagNameMap[E]>,
	name: string,
	customName: keyof EventHandlers<HTMLElementTagNameMap[E]>,
) => {
	if (props && props[customName]) {
		//@ts-ignore
		element.addEventListener(name, props[customName]);
		Reflect.deleteProperty(props, customName);
	}
};

const initPlugin = (plata = P) => {
	plata.plugins.push(<T extends HTMLElement>(el: T, attr: Attributes<T>) => {
		addEventHandler(el, attr, 'click', 'onClick');
		addEventHandler(el, attr, 'change', 'onChange');
	});
};

initPlugin();

export default initPlugin;
