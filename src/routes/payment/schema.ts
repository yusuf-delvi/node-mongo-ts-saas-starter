import Joi from 'joi';
import { JoiAuthBearer } from '../../helpers/validator';
import { SubscriptionType } from '../../database/User/user.types';

export default {
	createPortalSession: Joi.object().keys({
		subscriptionPlan: Joi.string()
			.valid(...Object.values(SubscriptionType))
			.required(),
	}),
	// updateSubscription: Joi.object().keys({
	// 	newSubscriptionPlan: Joi.string().valid('PREMIUM').required(),
	// }),
	retrieveTransactions: Joi.object().keys({
		filter: Joi.string().valid('ALL', 'SUCCEEDED').required(),
	}),
};
