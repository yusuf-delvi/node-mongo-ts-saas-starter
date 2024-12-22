import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/User/user.repo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import validator, { ValidationSource } from '../../helpers/validator';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import authentication from '../../auth/authentication';
import { Types } from 'mongoose';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import schema from './schema';
import { stripeAccount } from '../../config/index';
import User from '../../database/User/user.types';
import { SubscriptionType } from '../../database/User/user.types';

const router = express.Router();

router.use(bodyParser.raw({ type: 'application/json' }));

router.post(
	'/',
	express.json({ type: 'application/json' }),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const event = req.body;

		let handledEvent;

		let activeSubscription;

		let subscriptionPlan = '';

		const subsciptionId = event.data.object.id;

		const customerId = event.data.object.customer;

		const subscriptionPriceId = event.data.object.plan?.id;

		const subscriptionStatus = event.data.object.status;

		if (subscriptionPriceId === stripeAccount.priceIdPremium) {
			subscriptionPlan = SubscriptionType.PROFESSIONAL;
		}

		if (subscriptionStatus === 'active') {
			activeSubscription = true;
		} else {
			activeSubscription = false;
			subscriptionPlan = SubscriptionType.FREE;
		}

		switch (event.type) {
			case 'payment_intent.succeeded':
				handledEvent = event.data.object;

				break;

			case 'payment_intent.payment_failed':
				handledEvent = event.data.object;

				const user = await UserRepo.findByCustomerId(customerId);

				if (!user) throw new BadRequestError('User not found');

				const updatedFailedStatus = await UserRepo.updateInfo({
					_id: user._id,
					isSubscriptionActive: activeSubscription,
					subscription: subscriptionPlan,
				} as User);

				break;

			case 'customer.subscription.deleted':
				handledEvent = event.data.object;
				const foundUserInvoiceFailed = await UserRepo.findByCustomerId(
					customerId,
				);

				if (!foundUserInvoiceFailed)
					throw new BadRequestError('User not found');

				const updatedSubscriptionStatus = await UserRepo.updateInfo({
					_id: foundUserInvoiceFailed._id,
					subscriptionId: subsciptionId,
					isSubscriptionActive: activeSubscription,
					subscription: subscriptionPlan,
				} as User);

				break;

			case 'checkout.session.completed':
				handledEvent = event.data.object;

				break;

			case 'invoice.payment_failed':
				handledEvent = event.data.object;

				break;

			case 'invoice.updated':
				handledEvent = event.data.object;

				break;

			case 'customer.updated':
				handledEvent = event.data.object;

				break;

			case 'invoice.created':
				handledEvent = event.data.object;

				break;

			case 'customer.subscription.updated':
				handledEvent = event.data.object;

				const foundUser = await UserRepo.findByCustomerId(customerId);

				if (!foundUser) throw new BadRequestError('User not found');

				const updatedUser = await UserRepo.updateInfo({
					_id: foundUser._id,
					subscriptionId: subsciptionId,
					isSubscriptionActive: activeSubscription,
					subscription: subscriptionPlan,
				} as User);

				break;

			case 'invoice.paid':
			case 'invoice.payment_succeeded':
			case 'invoiceitem.created':
			case 'invoice.finalized':
				break;

			default:
		}

		new SuccessResponse('Success', { payment: handledEvent }).send(res);
	}),
);

export default router;
