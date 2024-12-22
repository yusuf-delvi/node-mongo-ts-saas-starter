import Joi from 'joi';
import { JoiAuthBearer } from '../../helpers/validator';

export default {
	credential: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	}),
	refreshToken: Joi.object().keys({
		refreshToken: Joi.string().required().min(1),
	}),
	auth: Joi.object()
		.keys({
			authorization: JoiAuthBearer().required(),
		})
		.unknown(true),
	signup: Joi.object().keys({
		name: Joi.string().min(3).required(),
		email: Joi.string()
			.required()
			.email()
			.messages({ 'string.email': 'Invalid email' }),
		password: Joi.string().required().min(8),
	}),
	google: Joi.object().keys({
		token: Joi.string().required(),
	}),
	verifyMail: Joi.object().keys({
		email: Joi.string().required(),
		otp: Joi.string().required(),
	}),
	tokenValidity: Joi.object().keys({
		token: Joi.string().required(),
	}),
	setPassword: Joi.object().keys({
		email: Joi.string().required(),
		otp: Joi.string().required(),
		password: Joi.string().required().min(6),
		confirmPassword: Joi.string().required().min(6),
	}),
	forgetPassword: Joi.object().keys({
		email: Joi.string().required(),
	}),
	resendOtp: Joi.object().keys({
		email: Joi.string().required(),
	}),
};
