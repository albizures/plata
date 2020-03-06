import { createObservable } from '@plata/observables';
import * as P from '@plata/core';

const Hello = () => {
	const inputRef = P.createRef<HTMLInputElement>();
	const name = createObservable<string>('');

	P.on(inputRef, 'keyup', (event: P.ChangeEvent<HTMLInputElement>) => {
		name.value = event.target.value;
	});

	return (
		<div>
			<div>
				<input ref={inputRef} type="text" />
			</div>
			<span>Hello {name}</span>
		</div>
	);
};

const root = document.getElementById('root');
if (root) {
	P.render(<Hello />, root);
}
