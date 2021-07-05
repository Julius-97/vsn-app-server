"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerNotifications = void 0;
const expo_server_sdk_1 = require("expo-server-sdk");
const subscription_1 = require("../models/subscription");
let expo = new expo_server_sdk_1.Expo();
const triggerNotifications = (articles) => __awaiter(void 0, void 0, void 0, function* () {
    const subs = yield subscription_1.Subscription.find({}).exec();
    let messages = [];
    for (let sub of subs) {
        const catsSub = sub.categories;
        for (let article of articles) {
            if (article.categories.filter((catArt) => {
                return catsSub.includes(catArt._id);
            }).length > 0) {
                messages.push(makeNotification(sub, article));
            }
        }
    }
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
        try {
            let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
            console.log('push notification sent', ticketChunk);
            tickets.push(...ticketChunk);
        }
        catch (error) {
            console.error(error);
        }
    }
});
exports.triggerNotifications = triggerNotifications;
const makeNotification = (sub, article) => {
    let message;
    message = {
        to: sub.tokenID,
        sound: 'default',
        body: article.categories.map((cat) => cat.name).join(' , '),
        title: article.title,
        data: { link: article.link },
    };
    return message;
};
