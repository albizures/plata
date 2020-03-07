import '@plata/prop-events';
import { Try, Fragment } from '@plata/components';
import { createObservable } from '@plata/observables';
import * as P from '@plata/core/src';

interface PropTypes {
	fixed: boolean;
}

const Fail: P.Component<PropTypes> = (props) => {
	if (props.fixed) {
		return <div>:)</div>;
	}

	throw new Error('something bad happend here');
};

const Dangerous: P.Component<PropTypes> = (props) => {
	const { fixed } = props;
	return (
		<Fragment>
			<Try fallback={<div>someone failed :(</div>}>
				<div>
					<span>I won't be show if one of my sibligs fail </span>
					<Fail fixed={fixed} />
				</div>
			</Try>
			<Try fallback={<div>this too failed :(</div>}>
				<Fail fixed={fixed} />
			</Try>
		</Fragment>
	);
};

const LABEL_FIX = 'Magic Fix';
const LABEL_FAIL = 'Magic fail';

const App = () => {
	const fixed = createObservable<boolean>(false);
	const ref = P.createRef<HTMLDivElement>();
	const label = createObservable(LABEL_FIX);

	fixed.watch((value) => {
		label.value = value ? LABEL_FIX : LABEL_FAIL;

		P.replaceContent(ref, <Dangerous fixed={Boolean(value)} />);
	});

	const onClick = () => {
		fixed.value = !fixed.value;
	};

	return (
		<Fragment>
			<div ref={ref}>
				<Dangerous fixed={Boolean(fixed.value)} />
			</div>
			<button onClick={onClick}>{label}</button>
		</Fragment>
	);
};

const root = document.getElementById('root');
if (root) {
	P.render(<App />, root);
}
