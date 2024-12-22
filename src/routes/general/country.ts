import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { NoDataError } from '../../core/ApiError';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
import CountryRepo from '../../database/Country/country.repo';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.get(
	'/',
	asyncHandler(async (req: ProtectedRequest, res) => {
		const foundCountries = await CountryRepo.findAll();

		return new SuccessResponse('success', foundCountries).send(res);
	}),
);

router.get(
	'/:countryId',
	validator(schema.getCountryById, ValidationSource.PARAM),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const foundCountry = await CountryRepo.findById(+req.params.countryId);

		if (!foundCountry) throw new NoDataError('Country not found');

		return new SuccessResponse('success', foundCountry).send(res);
	}),
);

export default router;
