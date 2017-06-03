import express from 'express';
import { watherRouter } from './weather';
import { messengerRouter } from './messenger';
export const router = new express.Router();

router.use('/v1/weather/', watherRouter);
router.use('/v1/messenger-hooks/', messengerRouter);
