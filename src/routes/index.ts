import express from 'express';
import apikey from '../auth/apikey';
import permission from '../helpers/permission';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import credential from './access/credential';
import profile from './profile';
import general from './general';
import payment from './payment';
import webhook from './payment/webHook';
import { Permission } from '../database/ApiKey/apikey.types';

const router = express.Router();

router.use('/webhook', webhook);

/*---------------------------------------------------------*/
router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use('/login', login);
router.use('/signup', signup);
router.use('/logout', logout);
router.use('/token', token);
router.use('/credential', credential);
router.use('/profile', profile);
router.use('/general', general);
router.use('/payment', payment);

export default router;
