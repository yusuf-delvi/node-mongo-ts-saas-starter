import User from '../../database/User/user.types';
import _ from 'lodash';

export const enum AccessMode {
	LOGIN = 'LOGIN',
	SIGNUP = 'SIGNUP',
}

export async function getUserData(user: User) {
	const data = _.pick(user, [
		'_id',
		'name',
		'email',
		'isEmailVerified',
		'profilePicUrl',
		'profession',
		'isGuideCompleted',
		'authType',
	]);

	return data;
}
