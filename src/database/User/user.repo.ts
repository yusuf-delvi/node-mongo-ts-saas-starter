import { UserModel } from './user.model';
import User from './user.types';
import { ClientSession, Types } from 'mongoose';
import KeystoreRepo from '../KeyStore/keystore.repo';
import Keystore from '../KeyStore/keystore.types';

async function exists(id: Types.ObjectId): Promise<boolean> {
	const user = await UserModel.exists({ _id: id });
	return user !== null && user !== undefined;
}

async function findPrivateProfileById(
	id: Types.ObjectId,
): Promise<User | null> {
	return UserModel.findOne({ _id: id })
		.select('+email +userId +password')
		.populate({ path: 'address.country address.city', select: 'name _id' })
		.lean<User>()
		.exec();
}

// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<User | null> {
	return UserModel.findOne({ _id: id })
		.select('+email +password +userId +verificationToken')

		.lean<User>()
		.exec();
}

async function findByFields(fields: any): Promise<User | null> {
	return UserModel.findOne(fields)
		.select('+email +role +userId')
		.lean<User>()
		.exec();
}

async function findByFieldsWithPagination(
	fields: any,
	page: number,
	limit: number,
): Promise<User[] | []> {
	return UserModel.find(fields)
		.select('+email +role +userId')
		.limit(limit)
		.skip(limit * (page - 1))
		.lean<User[]>()
		.exec();
}

async function findByEmail(email: string): Promise<User | null> {
	return UserModel.findOne({ email: email.toLowerCase() })
		.select(
			'+email +password +isEmailVerified +profession +role +gender +dob +country +state +city +verificationToken +authType',
		)
		.lean<User>()
		.exec();
}

async function findByCustomerId(customerId: string): Promise<User | null> {
	return UserModel.findOne({ customerId: customerId })
		.select(
			'+email +password +isEmailVerified +profession +subscriptionId +subscription',
		)
		.lean<User>()
		.exec();
}

async function findByVerificationToken(token: string): Promise<User | null> {
	return UserModel.findOne({ 'verificationToken.token': token })
		.select('_id verificationToken userId')
		.lean<User>()
		.exec();
}

async function findFieldsById(
	id: Types.ObjectId,
	...fields: string[]
): Promise<User | null> {
	return UserModel.findOne({ _id: id }, [...fields])
		.lean<User>()
		.exec();
}

async function findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
	return UserModel.findOne({ _id: id })
		.select(
			'_id profilePicUrl approvalStatus email name phoneNumber countryCode gender address clinic privilege isActive userId role password',
		)
		.populate({ path: 'address.country address.city', select: 'name _id' })
		.populate({ path: 'role', select: 'code' })
		.lean<User>()
		.exec();
}

async function create(user: User): Promise<User | null> {
	const now = new Date();

	if (user.email) user.email = user.email.toLowerCase();

	user.createdAt = user.updatedAt = now;
	const createdUser = await UserModel.create(user);

	return createdUser.toObject();
}

async function update(
	user: User,
	accessTokenKey: string,
	refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
	user.updatedAt = new Date();

	if (user.email) user.email = user.email.toLowerCase();

	await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
		.lean<User>()
		.exec();

	const keystore = await KeystoreRepo.create(
		user,
		accessTokenKey,
		refreshTokenKey,
	);

	return { user: user, keystore: keystore };
}

async function updateInfo(user: User): Promise<any> {
	if (user.email) user.email = user.email.toLowerCase();
	user.updatedAt = new Date();
	return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
		.lean<User>()
		.exec();
}

async function deleteById(userId: Types.ObjectId) {
	return UserModel.deleteOne({ _id: userId }).exec();
}

async function search(query: string, limit: number): Promise<User[]> {
	const findQuery: any = {};
	if (query.length > 0) {
		const startingLetters = query.slice(0, 4);
		const restOfQuery = query.slice(4);
		const regex = new RegExp(`^${startingLetters}${restOfQuery}`, 'i');
		findQuery['$or'] = [
			{ name: { $regex: regex } },
			{ email: { $regex: regex } },
			{ userId: { $regex: regex } },
		];
	}

	return UserModel.find(findQuery)
		.select('_id name email profilePicUrl patient userId')
		.limit(limit)
		.lean<User[]>()
		.exec();
}

async function addTokenCount(
	userId: Types.ObjectId,
	promptTokens: number,
	completionTokens: number,
	aiModel: 'GPT_4_TURBO_PREVIEW' | 'GPT_4' | 'GPT_3_TURBO_0125',
	session?: ClientSession,
): Promise<any> {
	const sessionObj = session ? { session } : {};
	return UserModel.updateOne(
		{ _id: userId },
		{
			$inc: {
				[`tokenCount.${aiModel}.promptTokens`]: promptTokens,
				[`tokenCount.${aiModel}.completionTokens`]: completionTokens,
				[`monthlyTokenCount.${aiModel}.promptTokens`]: promptTokens,
				[`monthlyTokenCount.${aiModel}.completionTokens`]: completionTokens,
			},
		},
		sessionObj,
	).exec();
}

export default {
	exists,
	search,
	findPrivateProfileById,
	findById,
	findByEmail,
	findByVerificationToken,
	findFieldsById,
	findPublicProfileById,
	create,
	update,
	updateInfo,
	deleteById,
	findByFields,
	findByFieldsWithPagination,
	findByCustomerId,
	addTokenCount,
};
