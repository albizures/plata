import * as P from '@plata/core';
import { createObservable } from '@plata/observables';

interface TryPropTypes {
	fallback?: P.Children;
	children: P.ObservableValues;
}

function notUndefined<T>(x: T | undefined): x is T {
	return x !== undefined;
}

const Try: P.Component<TryPropTypes> = async (props) => {
	const { children, fallback } = props;
	try {
		const items = await Promise.all<P.Child | Node[]>(P.flat(children));
		const childListe = P.flat(items.filter(notUndefined));

		return <Fragment>{childListe}</Fragment>;
	} catch (error) {
		console.error(error);

		return <Fragment>{fallback}</Fragment>;
	}
};

interface WaitPropTypes {
	fallback?: P.PlataElement;
	children: P.Children;
	waitAtLeast?: number;
}

const Wait: P.Component<WaitPropTypes> = (props) => {
	const { fallback, waitAtLeast = 0 } = props;
	const observable = createObservable<P.PlataElement>();
	if (fallback) {
		observable.value = fallback;
	}

	const waitAtLeastPromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, waitAtLeast);
	});

	Promise.resolve(props.children).then(async (element) => {
		await waitAtLeastPromise;
		if (element) {
			observable.value = Promise.resolve(element) as P.PlataElement;
		}
	});

	return <Fragment>{observable}</Fragment>;
};

// @ts-ignore
const Fragment: P.Component = async (props) => {
	const observable = createObservable<(P.Children | undefined)[]>(
		P.flat(props.children),
	);

	return observable;
};

export { Fragment, Wait, Try };
