import '@plata/prop-events';
import * as P from '@plata/core/src';

const Counter = () => {
	const spanRef = P.createRef<HTMLSpanElement>();
	const buttonRef = P.createRef<HTMLButtonElement>();
	let counter = 0;

	const onClick = () => {
		counter = counter + 1;

		P.replaceContent(spanRef, counter);
	};

	return (
		<div>
			<span ref={spanRef}>{counter}</span>
			<button onClick={onClick} ref={buttonRef}>
				click me
			</button>
		</div>
	);
};

P.render(<Counter />, document.getElementById('root'));
