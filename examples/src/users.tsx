import '@plata/prop-events';
import { createObservable } from '@plata/observables';
import * as P from '@plata/core/src';

interface User {
	first_name: string;
}

const UserList: P.Component = () => {
	const observable = createObservable<P.Children>();

	fetch('https://reqres.in/api/users').then(async (response) => {
		const { data } = await response.json();
		const users = data as User[];

		setTimeout(() => {
			observable.value = users.map((user) => {
				return <li>{user.first_name}</li>;
			});
		}, 1000);
	});

	return <div>{observable}</div>;
};

const Users = () => {
	const inputRef = P.createRef<HTMLInputElement>();
	const name = createObservable<string>('');

	P.on(inputRef, 'keyup', (event: P.ChangeEvent<HTMLInputElement>) => {
		name.value = event.target.value;
	});

	return (
		<ul>
			<UserList />
		</ul>
	);
};

const root = document.getElementById('root');
if (root) {
	P.render(<Users />, root);
}
