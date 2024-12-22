import express from 'express';
import ApiKeyRepo from '../database/ApiKey/apikey.repo';
import { ForbiddenError } from '../core/ApiError';
import Logger from '../core/Logger';
import { PublicRequest } from 'app-request';
import schema from './schema';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';
import { Header } from '../core/utils';

const exclude: string[] = ['/general/error'];

const router = express.Router();

export default router.use(
	asyncHandler(async (req: PublicRequest, res, next) => {
		if (exclude.includes(req.path)) return next();

		validator(schema.apiKey, ValidationSource.HEADER);

		const key = req.headers[Header.API_KEY]?.toString();
		if (!key) throw new ForbiddenError();

		const apiKey = await ApiKeyRepo.findByKey(key);
		if (!apiKey) throw new ForbiddenError();
		Logger.info(apiKey);

		req.apiKey = apiKey;
		return next();
	}),
);
