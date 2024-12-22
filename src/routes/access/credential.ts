import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { PublicRequest } from 'app-request';
import UserRepo from '../../database/User/user.repo';
import { BadRequestError, TokenExpiredError } from '../../core/ApiError';
import User from '../../database/User/user.types';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import moment from 'moment';
import { sendMail } from '../../helpers/mail';

const router = express.Router();

router.post(
	'/forget',
	validator(schema.forgetPassword, ValidationSource.BODY),
	asyncHandler(async (req: PublicRequest, res) => {
		const { email } = req.body;

		const user = await UserRepo.findByEmail(email);

		if (!user) throw new BadRequestError('User is not registered');

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

		new SuccessResponse(
			'Verification token sent. It will be effective for 15 minutes',
			{},
		).send(res);
	}),
);

router.put(
	'/forget/setpassword',
	validator(schema.setPassword, ValidationSource.BODY),
	asyncHandler(async (req: PublicRequest, res) => {
		const { email, otp, password, confirmPassword } = req.body;

		const user = await UserRepo.findByEmail(email);

		if (!user) throw new BadRequestError('User is not registered');

		if (!user.verificationToken || !user.verificationToken.token)
			throw new BadRequestError('Invalid OTP');

		if (moment().isAfter(user.verificationToken.expiresAt)) {
			throw new TokenExpiredError('OTP expired');
		}

		const isMatch = await bcrypt.compare(otp, user.verificationToken.token);

		if (!isMatch) throw new BadRequestError('Invalid OTP');

		if (password !== confirmPassword)
			throw new BadRequestError('Password and confirm password does not match');

		const passwordHash = await bcrypt.hash(password, 10);

		const updatedUser = await UserRepo.updateInfo({
			_id: user._id,
			password: passwordHash,
			verificationToken: {
				token: null,
				expiresAt: null,
			},
		} as User);

		new SuccessResponse(
			'Password updated',
			_.pick(updatedUser, ['profilePicUrl', 'name', 'userName', 'email']),
		).send(res);
	}),
);

router.post(
	'/verifyOtp',
	asyncHandler(async (req: PublicRequest, res) => {
		const { email, otp } = req.body;

		const foundUser = await UserRepo.findByEmail(email);

		if (
			!foundUser ||
			!foundUser.verificationToken ||
			!foundUser.verificationToken.token
		)
			throw new BadRequestError('User not found');

		const isMatch = await bcrypt.compare(
			otp,
			foundUser.verificationToken.token,
		);

		if (!isMatch) throw new BadRequestError('Invalid OTP');

		new SuccessResponse('User verified successfully', {}).send(res);
	}),
);

export default router;
