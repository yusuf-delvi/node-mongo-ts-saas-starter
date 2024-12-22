import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../core/ApiError';
import { PublicRequest } from '../types/app-request';

const exclude: string[] = ['/general/error'];

export default (permission: string) =>
	(req: PublicRequest, res: Response, next: NextFunction) => {
		try {
			if (exclude.includes(req.path)) return next();

			if (!req.apiKey?.permissions)
				return next(new ForbiddenError('Permission Denied'));

			const exists = req.apiKey.permissions.find(
				(entry) => entry === permission,
			);

			if (!exists) return next(new ForbiddenError('Permission Denied'));

			next();
		} catch (error) {
			next(error);
		}
	};
