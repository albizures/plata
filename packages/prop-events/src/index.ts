import { ElementNames, Attributes, EventHandlers } from '@plata/core/src/types';
import * as P from '@plata/core';

const addEventHandler = <E extends ElementNames>(
	element: HTMLElement,
	props: Attributes<HTMLElementTagNameMap[E]>,
	name: string,
	customName: keyof EventHandlers<HTMLElementTagNameMap[E]>,
) => {
	if (props && props[customName]) {
		element.addEventListener(
			name,
			props[customName] as EventListenerOrEventListenerObject,
		);
		Reflect.deleteProperty(props, customName);
	}
};

const initPlugin = (plata = P) => {
	plata.plugins.push(
		<E extends ElementNames>(
			el: HTMLElementTagNameMap[E],
			attr: Attributes<HTMLElementTagNameMap[E]>,
		) => {
			addEventHandler(el, attr, 'click', 'onClick');
			addEventHandler(el, attr, 'change', 'onChange');
		},
	);
};

initPlugin();

export default initPlugin;
