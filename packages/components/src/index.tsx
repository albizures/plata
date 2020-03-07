import * as P from '@plata/core';
import { createObservable } from '@plata/observables';
import { flat } from './utils';

interface TryPropTypes {
	fallback?: P.Children;
}

const Try: P.Component<TryPropTypes> = async (props) => {
	const { children, fallback } = props;
	try {
		const resolvedChildren = await Promise.all(P.toArray(children));

		return <Fragment>{resolvedChildren}</Fragment>;
	} catch (error) {
		console.error(error);

		return <Fragment>{fallback || null}</Fragment>;
	}
};

interface WaitPropTypes {
	fallback?: P.Children;
	waitAtLeast?: number;
}

const Wait: P.Component<WaitPropTypes> = (props) => {
	const { fallback, waitAtLeast = 0 } = props;
	const observable = createObservable<P.Children>();
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
		flat(props.children),
	);

	return observable;
};

export { Fragment, Wait, Try };
