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
import schema from './schema';
import { SubscriptionType } from '../../database/User/user.types';
import { stripeAccount, frontEndHost } from '../../config/index';

const router = express.Router();
router.use(authentication);

router.post(
	'/create-portalsession',
	validator(schema.createPortalSession, ValidationSource.BODY),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const { subscriptionPlan } = req.body;
		const stripe = new Stripe(stripeAccount.secretKey as string, {
			apiVersion: '2023-10-16',
		});

		let priceId;

		if (subscriptionPlan === SubscriptionType.PROFESSIONAL) {
			priceId = stripeAccount.priceIdPremium as string;
		}
		const session = await stripe.checkout.sessions.create({
			customer: req.user.customerId,
			payment_method_types: ['card'],
			billing_address_collection: 'required',
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: frontEndHost as string,
			cancel_url: frontEndHost as string,
		});

		new SuccessResponse('Success', session.url).send(res);
	}),
);

// router.post(
// 	'/update-subscription',
// 	validator(schema.updateSubscription, ValidationSource.BODY),
// 	asyncHandler(async (req: ProtectedRequest, res) => {
// 		const { newSubscriptionPlan } = req.body;

// 		const stripe = new Stripe(stripeAccount.secretKey as string, {
// 			apiVersion: '2023-10-16',
// 		});

// 		let newPriceId;

// 		if (newSubscriptionPlan === 'PROFESSIONAL') {
// 			newPriceId = stripeAccount.priceIdBasic as string;
// 		} else if (newSubscriptionPlan === 'PREMIUM') {
// 			newPriceId = stripeAccount.priceIdPremium as string;
// 		} else {
// 			return res.status(400).json({ error: 'Invalid subscription plan' });
// 		}

// 		const subscription = await stripe.subscriptions.retrieve(
// 			req.user.subscriptionId,
// 		);

// 		const updateSubscriptionPlan = await stripe.subscriptions.update(
// 			req.user.subscriptionId,
// 			{
// 				items: [
// 					{
// 						id: subscription.items.data[0].id,
// 						price: newPriceId,
// 					},
// 				],
// 				billing_cycle_anchor: 'now',
// 			},
// 		);

// 		new SuccessResponse('Subscription updated successfully', {
// 			updateSubscriptionPlan: newSubscriptionPlan,
// 		}).send(res);
// 	}),
// );

router.get(
	'/retrieveTransactions',
	validator(schema.retrieveTransactions, ValidationSource.QUERY),
	asyncHandler(async (req: ProtectedRequest, res) => {
		const stripe = new Stripe(stripeAccount.secretKey as string, {
			apiVersion: '2023-10-16',
		});

		const filter = req.query.filter as string;

		const transactions = await stripe.paymentIntents.list({
			customer: req.user.customerId,
			limit: 10,
		});

		if (filter === 'SUCCEEDED') {
			const succeededTransactions = transactions.data.filter(
				(transaction) => transaction.status === 'succeeded',
			);

			new SuccessResponse('Success', {
				successfulPayments: succeededTransactions,
			}).send(res);
		}

		if (filter === 'ALL') {
			new SuccessResponse('Success', { payments: transactions.data }).send(res);
		}
	}),
);

export default router;
