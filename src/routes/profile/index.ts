import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/User/user.repo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import authentication from '../../auth/authentication';
import { Types } from 'mongoose';
import User from '../../database/User/user.types';
import { s3 } from '../../config/aws';
import { aws as awsConfig } from '../../config/index';
import _ from 'lodash';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.get(
	'/my',
	asyncHandler(async (req: ProtectedRequest, res) => {
		const user = await UserRepo.findPrivateProfileById(req.user._id);
		if (!user) throw new BadRequestError('User is not registered');

		return new SuccessResponse('success', {
			..._.pick(user, [
				'name',
				'email',
				'profilePicUrl',
				'phoneNumber',
				'countryCode',
				'address',
				'userName',
				'profession',
				'customerId',
				'subscriptionId',
				'subscription',
				'isSubscriptionActive',
			]),
		}).send(res);
	}),
);

router.post(
	'/updatepassword',
	authentication,
	validator(schema.updatePassword),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const user = await UserRepo.findPrivateProfileById(req.user._id);
		if (!user) throw new BadRequestError('User is not registered');

		const { currentPassword, newPassword, confirmPassword } = req.body;

		if (!user.password) throw new BadRequestError('Password not set');
		const match = await bcrypt.compare(currentPassword, user.password);

		if (!match) throw new BadRequestError('Invalid current password');

		if (newPassword !== confirmPassword)
			throw new BadRequestError(
				'New password and confirm password does not match',
			);

		const passwordHash = await bcrypt.hash(newPassword, 10);

		await UserRepo.updateInfo({
			_id: user._id,
			password: passwordHash,
		} as User);

		return new SuccessResponse('Password updated', {}).send(res);
	}),
);

router.get(
	'/:id',
	validator(schema.userId, ValidationSource.PARAM),
	asyncHandler(async (req, res) => {
		const foundUser = await UserRepo.findPublicProfileById(
			new Types.ObjectId(req.params.id),
		);

		if (!foundUser) throw new BadRequestError('User is not registered');

		return new SuccessResponse('success', foundUser).send(res);
	}),
);

router.put(
	'/',
	validator(schema.update),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const user = await UserRepo.findPrivateProfileById(req.user._id);

		if (!user) throw new BadRequestError('User not registered');

		let updatedUrl = null;

		if (!_.isEmpty(req.body.profilePicUrl)) {
			const urlParts = new URL(req.body.profilePicUrl);

			const hostnameParts = urlParts.hostname.split('.');

			if (hostnameParts[0] === awsConfig.s3AssetsBucketTemp) {
				const s3Subdomain = hostnameParts.slice(1).join('.');

				const pathParts = urlParts.pathname.split('/');

				const sourceBucket = awsConfig.s3AssetsBucketTemp;
				const destinationBucket = awsConfig.s3AssetsBucket;
				const sourceKey = pathParts.slice(1).join('/');

				if (!sourceBucket || !sourceKey || !destinationBucket) {
					throw new BadRequestError('Invalid profile picture URL');
				}

				const copyParams = {
					Bucket: destinationBucket,
					CopySource: `/${sourceBucket}/${sourceKey}`,
					Key: sourceKey,
				};

				await s3.copyObject(copyParams).promise();

				// await s3
				// 	.deleteObject({ Bucket: sourceBucket, Key: sourceKey })
				// 	.promise();

				updatedUrl = `${awsConfig.cloudFrontUrl}/${sourceKey}`;
			}
		}

		const updateObj = {
			...req.body,
			_id: req.user._id,
		} as User;

		if (updatedUrl) {
			updateObj.profilePicUrl = updatedUrl;
		}

		const updatedUser = await UserRepo.updateInfo(updateObj);

		return new SuccessResponse(
			'Profile updated',
			_.pick(updateObj, [
				'_id',
				'name',
				'profilePicUrl',
				'userName',
				'profession',
				'phoneNumber',
				'countryCode',
				'address',
				'isGuideCompleted',
			]),
		).send(res);
	}),
);

export default router;
