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
		const resolvedChildren = await Promise.all(P.toArray(children));
		const b = resolvedChildren.filter(notUndefined);

		return <Fragment>{b}</Fragment>;
	} catch (error) {
		console.error(error);

		return <Fragment>{fallback}</Fragment>;
	}
};

interface WaitPropTypes {
	fallback?: P.ObservableValues;
	waitAtLeast?: number;
}

const Wait: P.Component<WaitPropTypes> = (props) => {
	const { fallback, waitAtLeast = 0 } = props;
	const observable = createObservable<P.ObservableValues>();
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
		observable.value = element || null;
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
