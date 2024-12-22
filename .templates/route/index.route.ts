/*
import express from 'express';
import { ProtectedRequest } from 'app-request';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { BadRequestError } from '../../core/ApiError';
import authentication from '../../auth/authentication';

const router = express.Router();

//----------------------------------------------------------------
router.use(authentication, role(RoleCode.ADMIN), authorization);
//----------------------------------------------------------------

router.post(
  '/sample',
  validator(schema.sample, ValidationSource.BODY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    new SuccessResponse('Success', {}).send(res);
  }),
);

export default router;
*/
