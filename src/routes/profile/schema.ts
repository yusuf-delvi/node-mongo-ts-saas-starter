import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
	userId: Joi.object().keys({
		id: JoiObjectId().required(),
	}),
	update: Joi.object().keys({
		name: Joi.string().min(1).max(200).optional(),
		profession: Joi.string().optional().allow(''),
		profilePicUrl: Joi.string().uri().allow(''),
		age: Joi.number().optional().allow('', null),
		experience: Joi.number().optional().allow('', null),
		userName: Joi.string()
			.min(1)
			.max(200)
			.trim()
			.custom((value, helpers) => {
				if (value.includes(' ')) {
					return helpers.message({ custom: 'Username cannot contain spaces' });
				}
				return value;
			}),
		bio: Joi.string().min(1).max(200).optional(),
		phoneNumber: Joi.number().optional().allow('', null),
		countryCode: Joi.string().optional().allow('', null),
		address: Joi.object().keys({
			country: Joi.number(),
			city: Joi.number(),
			street: Joi.string(),
		}),
		isGuideCompleted: Joi.boolean(),
	}),
	updatePassword: Joi.object().keys({
		currentPassword: Joi.string().required(),
		newPassword: Joi.string().required().min(8),
		confirmPassword: Joi.string().required().min(8),
	}),
	// updateLabUser: Joi.object().keys({
	// 	name: Joi.string().min(1).max(200),
	// 	profilePicUrl: Joi.string().uri(),
	// 	email: Joi.string().email().messages({ 'string.email': 'Invalid email' }),
	// 	phoneNumber: Joi.number().optional().allow('', null),
	// 	countryCode: Joi.string().optional().allow('', null),
	// 	isActive: Joi.bool(),
	// }),
};
