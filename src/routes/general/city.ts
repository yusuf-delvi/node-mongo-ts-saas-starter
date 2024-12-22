import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { NoDataError } from '../../core/ApiError';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
import CityRepo from '../../database/City/city.repo';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.get(
	'/:cityId',
	validator(schema.cityById, ValidationSource.PARAM),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const foundCity = await CityRepo.findById(+req.params.cityId);

		if (!foundCity) throw new NoDataError('City not found');

		return new SuccessResponse('success', foundCity).send(res);
	}),
);

router.get(
	'/byCountry/:countryId',
	validator(schema.citiesByCountryId, ValidationSource.PARAM),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const foundCities = await CityRepo.findByCountry(+req.params.countryId);

		return new SuccessResponse('success', foundCities).send(res);
	}),
);

export default router;
