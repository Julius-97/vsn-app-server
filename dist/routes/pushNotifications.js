"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pushNotifications_1 = require("../controllers/pushNotifications");
const router = express_1.Router();
router.post('/:tokenID', pushNotifications_1.subscribe);
router.get('/:tokenID', pushNotifications_1.getSubscriptionInfo);
exports.default = router;
