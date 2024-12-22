import Joi from 'joi';

export default {
	preSignedUrl: Joi.object().keys({
		extension: Joi.string().required(),
	}),
	deleteFile: Joi.object().keys({
		objectKey: Joi.string().uri().required(),
	}),
	getCountryById: Joi.object().keys({
		countryId: Joi.number().required().min(1),
	}),
	citiesByCountryId: Joi.object().keys({
		countryId: Joi.number().required().min(1),
	}),
	cityById: Joi.object().keys({
		cityId: Joi.number().required().min(1),
	}),
	getFilesByFolder: Joi.object().keys({
		folderName: Joi.string().min(14).required(),
	}),
	saveError: Joi.object().keys({
		error: Joi.object().keys({
			message: Joi.string(),
			stack: Joi.string(),
			user: Joi.string(),
			timestamp: Joi.string().optional().allow(''),
		}),
	}),
};
