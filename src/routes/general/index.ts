import express from 'express';

const router = express.Router();

import file from './file';
import country from './country';
import city from './city';
import error from './error';

router.use('/file', file);
router.use('/countries', country);
router.use('/cities', city);
router.use('/error', error);

export default router;
