import express from 'express';
import { messengerRouter } from './messenger';
export const router = new express.Router();

router.use('/v1/messenger-hooks/', messengerRouter);
