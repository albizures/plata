import * as P from '@plata/core';

const Counter = () => {
	const spanRef = P.createRef<HTMLSpanElement>();
	const buttonRef = P.createRef<HTMLButtonElement>();
	let counter = 0;

	P.on(buttonRef, 'click', () => {
		counter = counter + 1;

		P.replaceContent(spanRef, counter);
	});

	return (
		<div>
			<span ref={spanRef}>{counter}</span>
			<button ref={buttonRef}>click me</button>
		</div>
	);
};

P.render(<Counter />, document.getElementById('root'));
