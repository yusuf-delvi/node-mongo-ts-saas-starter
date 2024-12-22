import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../database/User/user.repo';
import {
	BadRequestError,
	AuthFailureError,
	EmailNotVerifiedError,
} from '../../core/ApiError';
import KeystoreRepo from '../../database/KeyStore/keystore.repo';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from './utils';
import { PublicRequest } from '../../types/app-request';
import { sendMail } from '../../helpers/mail';
import moment from 'moment';
import User, { AuthType } from '../../database/User/user.types';

const router = express.Router();

router.post(
	'/basic',
	validator(schema.credential),
	asyncHandler(async (req: PublicRequest, res) => {
		req.body.email = req.body.email.toLowerCase();

		const user = await UserRepo.findByEmail(req.body.email);
		if (!user) throw new BadRequestError('User is not registered');

		if (user && user.authType === AuthType.GOOGLE)
			throw new BadRequestError('User is registered using google');

		if (!user.password) throw new BadRequestError('Credentials not set');

		if (!user.isEmailVerified) {
			const otp = Math.floor(1000 + Math.random() * 9000);

			const otpHash = await bcrypt.hash(otp.toString(), 10);

			await UserRepo.updateInfo({
				_id: user._id,
				verificationToken: {
					token: otpHash,
					expiresAt: moment().add(2, 'minutes').toDate(),
				},
			} as User);

			await sendMail(
				user.email ?? '',
				'Password Reset Request',
				`<h1>Your one time password</h1><br><p style="font-size: 24px;">Dear ${
					user.name
				},<br><br> Your OTP is: <h1><b>${otp.toString()}</b></h1><br><br>If you have any questions, just drop us a mail at info@personachat.com and you can reach out in our Discord channel <a href="https://discord.gg/y987q8rm">Discord</a>, we are always happy to help you out<br><br>Best regards <br>Team Personachat</p>`,
				'otp',
			);

			throw new EmailNotVerifiedError('Email is not verified');
		}

		const match = await bcrypt.compare(req.body.password, user.password);

		if (!match) throw new AuthFailureError('Invalid username or password');

		const accessTokenKey = crypto.randomBytes(64).toString('hex');
		const refreshTokenKey = crypto.randomBytes(64).toString('hex');

		await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
		const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
		const userData = await getUserData(user);

		new SuccessResponse('Login Success', {
			userData: userData,
			tokens: tokens,
		}).send(res);
	}),
);

export default router;
