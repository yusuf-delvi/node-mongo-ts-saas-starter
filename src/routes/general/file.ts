import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { SuccessResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
import { Types } from 'mongoose';
import { s3 } from '../../config/aws';
import { aws as awsConfig } from '../../config/index';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.get(
	'/preSignedUrl',
	validator(schema.preSignedUrl, ValidationSource.QUERY),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const { extension } = req.query;

		const bucketName = awsConfig.s3AssetsBucketTemp;
		const randomString = uuidv4().replace(/-/g, '');
		const fileStr = `${randomString}.${extension}`;

		if (!bucketName) throw new BadRequestError('Something went wrong');

		const params = {
			Bucket: bucketName as string,
			Key: fileStr as string,
			Expires: 360, // expires in 6mins
		};

		const presignedUrl = await s3.getSignedUrlPromise('putObject', params);

		return new SuccessResponse('success', { presignedUrl }).send(res);
	}),
);

router.delete(
	'/delete',
	validator(schema.deleteFile, ValidationSource.QUERY),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const { objectKey } = req.query;

		const bucketName = awsConfig.s3AssetsBucket;
		const regex = /\/([^/]+)$/;
		const match = (objectKey as string).match(regex);

		const fileName = match ? match[1] : '';

		const params = {
			Bucket: bucketName as string,
			Key: fileName as string,
		};

		await s3.deleteObject(params).promise();

		return new SuccessResponse('File deleted', {}).send(res);
	}),
);

export default router;
