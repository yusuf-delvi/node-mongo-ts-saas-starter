import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { frontEndLogger } from '../../core/Logger';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';

const router = express.Router();

router.post(
	'/',
	validator(schema.saveError, ValidationSource.BODY),
	asyncHandler(async (req: ProtectedRequest, res) => {
		frontEndLogger.error(req.body.error);

		return new SuccessResponse('success', {}).send(res);
	}),
);

export default router;
