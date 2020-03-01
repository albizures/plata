import * as P from '@plata/core';

interface Todo {
	name: string;
}

interface PropTypes {
	name: string;
	onDone: (ref: P.Ref<HTMLLIElement>) => void;
}

const Todo = (props: PropTypes) => {
	const liRef = P.createRef<HTMLLIElement>();
	const buttonRef = P.createRef<HTMLButtonElement>();

	P.on(buttonRef, 'click', () => props.onDone(liRef));

	return (
		<li ref={liRef}>
			{props.name}
			<button ref={buttonRef}>done</button>
		</li>
	);
};

const Counter = () => {
	const buttonRef = P.createRef<HTMLButtonElement>();
	const listRef = P.createRef<HTMLUListElement>();
	const inputRef = P.createRef<HTMLInputElement>();
	let todos: Todo[] = [];

	P.on(buttonRef, 'click', () => {
		const name = inputRef.current.value;

		if (name === '') {
			return;
		}

		const todo = { name };
		todos.push(todo);

		const onDone = (ref: P.Ref<HTMLLIElement>) => {
			const index = todos.indexOf(todo);
			todos.splice(index, 1);
			P.remove(ref);
		};

		P.append(listRef, <Todo onDone={onDone} name={name} />);
		inputRef.current.value = '';
	});

	return (
		<div>
			<div>
				<label htmlFor="name">Name</label>
				<input ref={inputRef} type="text" id="name" />
			</div>
			<button ref={buttonRef}>add</button>
			<ul ref={listRef}></ul>
		</div>
	);
};

P.render(<Counter />, document.getElementById('root'));
