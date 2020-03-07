import '@plata/prop-events';
import { Wait, Fragment, Try } from '@plata/components';
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
	const loading = <div>loading...</div>;

	return (
		<ul>
			<Wait loading={loading} waitAtLeast={1000}>
				<Try fallback={<span>failed :(</span>}>
					<UserList />
				</Try>
			</Wait>
		</ul>
	);
};

const root = document.getElementById('root');
if (root) {
	P.render(<Users />, root);
}
