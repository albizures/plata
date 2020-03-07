import '@plata/prop-events';
import { Wait, Fragment } from '@plata/components';
import { createObservable } from '@plata/observables';
import * as P from '@plata/core/src';

interface User {
	first_name: string;
}

const UserList: P.Component = async () => {
	const response = await fetch('https://reqres.in/api/users');
	const { data } = await response.json();
	const users = data as User[];

	return (
		<Fragment>
			{users.map((user) => {
				return <li>{user.first_name}</li>;
			})}
		</Fragment>
	);
};

const Users = () => {
	const fallback = <div>loading...</div>;

	return (
		<ul>
			<Wait fallback={fallback} waitAtLeast={1000}>
				<UserList />
			</Wait>
		</ul>
	);
};

const root = document.getElementById('root');
if (root) {
	P.render(<Users />, root);
}
