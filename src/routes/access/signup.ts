import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import _ from 'lodash';
import { SuccessResponse } from '../../core/ApiResponse';
import { PublicRequest } from 'app-request';
import UserRepo from '../../database/User/user.repo';
import KeystoreRepo from '../../database/KeyStore/keystore.repo';
import { BadRequestError } from '../../core/ApiError';
import User, { AuthType } from '../../database/User/user.types';
import crypto from 'crypto';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from './utils';
import { sendMail } from '../../helpers/mail';
import moment from 'moment';
import { createTokens } from '../../auth/authUtils';
import { googleClient as GoogleClientConfig } from '../../config/index';
import Stripe from 'stripe';
import { stripeAccount } from '../../config/index';

const googleClient = new OAuth2Client(GoogleClientConfig.clientId);

const router = express.Router();

router.post(
	'/',
	validator(schema.signup),
	asyncHandler(async (req: PublicRequest, res) => {
		const user = await UserRepo.findByEmail(req.body.email);

		const otp = Math.floor(1000 + Math.random() * 9000);

		if (user) throw new BadRequestError('User is already registered');

		const passwordHash = await bcrypt.hash(req.body.password, 10);
		const otpHash = await bcrypt.hash(otp.toString(), 10);

		const stripe = new Stripe(stripeAccount.secretKey as string);

		const customer = await stripe.customers.create({
			email: req.body.email,
		});

		let createdUser: User | null = null;

		try {
			createdUser = await UserRepo.create({
				name: req.body.name,
				customerId: customer.id,
				email: req.body.email,
				password: passwordHash,
				verificationToken: {
					token: otpHash,
					expiresAt: moment().add(2, 'minutes').toDate(),
				},
			} as User);

			if (!createdUser) throw new BadRequestError('User is not created');
		} catch (e) {
			await stripe.customers.del(customer.id);
			throw new BadRequestError('User is not created');
		}

		const userData = await getUserData(createdUser);

		if (!userData) throw new BadRequestError('User is not created');

		await sendMail(
			userData.email ?? '',
			"Your One-Time Password (OTP)",
			`<h1>Your one time password</h1><br><p style="font-size: 24px;">Dear ${
				userData.name
			},<br><br> Your OTP is: <h1><b>${otp.toString()}</b></h1>`,
		);

		new SuccessResponse(
			'Signup Successful',
			_.pick(userData, ['_id', 'name', 'email']),
		).send(res);
	}),
);

router.post(
	'/google',
	validator(schema.google, ValidationSource.BODY),
	asyncHandler(async (req: PublicRequest, res) => {
		const { token } = req.body;

		const ticket = await googleClient.verifyIdToken({
			idToken: token,
			audience: GoogleClientConfig.clientId,
		});

		const payload = ticket.getPayload();

		if (!payload) throw new BadRequestError('Invalid token');

		const email = payload['email'];
		const name = payload['name'];
		const stripe = new Stripe(stripeAccount.secretKey as string);

		let foundUser = await UserRepo.findByEmail(email!);

		if (foundUser && foundUser.authType === AuthType.EMAIL) {
			throw new BadRequestError(
				'User is already registered using email and password',
			);
		}

		if (!foundUser) {
			const customer = await stripe.customers.create({
				email: email,
			});
			foundUser = await UserRepo.create({
				name: name,
				email: email,
				customerId: customer.id,
				authType: AuthType.GOOGLE,
				isEmailVerified: true,
			} as User);

			if (!foundUser) throw new BadRequestError('User is not created');
		}

		if (!foundUser) throw new BadRequestError('User is not created');

		const accessTokenKey = crypto.randomBytes(64).toString('hex');
		const refreshTokenKey = crypto.randomBytes(64).toString('hex');

		await KeystoreRepo.create(foundUser, accessTokenKey, refreshTokenKey);

		const tokens = await createTokens(
			foundUser,
			accessTokenKey,
			refreshTokenKey,
		);

		const userData = await getUserData(foundUser);

		if (!userData) throw new BadRequestError('User is not created');

		new SuccessResponse('Signup Successful', {
			userData: userData,
			tokens: tokens,
		}).send(res);
	}),
);

router.post(
	'/verifymail',
	validator(schema.verifyMail, ValidationSource.BODY),
	asyncHandler(async (req: PublicRequest, res) => {
		const { email, otp } = req.body;

		const foundUser = await UserRepo.findByEmail(email);

		if (
			!foundUser ||
			!foundUser.verificationToken ||
			!foundUser.verificationToken.token
		)
			throw new BadRequestError('User not found');

		if (
			foundUser.verificationToken.expiresAt &&
			moment().isAfter(moment(foundUser.verificationToken.expiresAt))
		) {
			throw new BadRequestError('OTP expired');
		}

		const isMatch = await bcrypt.compare(
			otp,
			foundUser.verificationToken.token,
		);

		if (!isMatch) throw new BadRequestError('Invalid OTP');

		await UserRepo.updateInfo({
			_id: foundUser?._id,
			isEmailVerified: true,
			verificationToken: {
				token: null,
				expiresAt: null,
			},
		} as User);

		const accessTokenKey = crypto.randomBytes(64).toString('hex');
		const refreshTokenKey = crypto.randomBytes(64).toString('hex');

		await KeystoreRepo.create(foundUser, accessTokenKey, refreshTokenKey);
		const tokens = await createTokens(
			foundUser,
			accessTokenKey,
			refreshTokenKey,
		);
		const userData = await getUserData(foundUser);

		new SuccessResponse('User verified successfully', {
			userData: userData,
			tokens: tokens,
		}).send(res);
	}),
);

export default router;
