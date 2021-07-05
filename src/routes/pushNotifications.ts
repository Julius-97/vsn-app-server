import { Router } from 'express';

import {
  getSubscriptionInfo,
  subscribe,
} from '../controllers/pushNotifications';

const router = Router();

router.post('/:tokenID', subscribe);

router.get('/:tokenID', getSubscriptionInfo);

export default router;
