import * as P from '@plata/core';
import { createObservable } from '@plata/observables';

// @ts-ignore
const Fragment: P.Component = (props) => {
	const observable = createObservable(props.children);

	return observable;
};

export { Fragment };
