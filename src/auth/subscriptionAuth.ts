import express from 'express';
import { ProtectedRequest } from 'app-request';
import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();

export default router.use(
	asyncHandler(async (req: ProtectedRequest, res, next) => {
		// Check if user has a subscription

		return next();
	}),
);
