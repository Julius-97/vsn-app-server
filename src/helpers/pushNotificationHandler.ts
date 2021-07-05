import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { isNull } from 'node:util';

import { IArticle } from '../models/article';
import { Category } from '../models/category';
import { ISubscription, Subscription } from '../models/subscription';

let expo = new Expo();

export const triggerNotifications = async (articles: IArticle[]) => {
  const subs = await Subscription.find({}).exec();
  let messages: ExpoPushMessage[] = [];
  for (let sub of subs) {
    const catsSub = sub.categories;
    for (let article of articles) {
      if (
        article.categories.filter((catArt) => {
          return catsSub.includes(catArt._id);
        }).length > 0
      ) {
        messages.push(makeNotification(sub, article));
      }
    }
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('push notification sent', ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
};

const makeNotification = (sub: ISubscription, article: IArticle) => {
  let message: ExpoPushMessage;

  message = {
    to: sub.tokenID,
    sound: 'default',
    body: article.categories.map((cat) => cat.name).join(' , '),
    title: article.title,
    data: { link: article.link },
  };
  return message;
};
