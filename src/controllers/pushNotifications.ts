import { RequestHandler } from 'express';
import { Error, Types } from 'mongoose';

import { Category, ICategory } from '../models/category';
import { ISubscription, Subscription } from '../models/subscription';

type subscriptionContent = {
  categories: string[];
};

export const getSubscriptionInfo: RequestHandler<{ tokenID: string }> = (
  req,
  res,
  next
) => {
  Subscription.findOne({ tokenID: req.params.tokenID })
    .populate('categories', 'name')
    .exec()
    .then((sub) => {
      if (sub) {
        res.status(200).json({
          tokenID: sub.tokenID,
          categories: sub.categories,
        });
      } else {
        res.status(404).json({ msg: 'subscription not found!' });
      }
    });
};

export const subscribe: RequestHandler<{ tokenID: string }> = async (
  req,
  res,
  next
) => {
  const selectedCategoriesID = (req.body as subscriptionContent).categories;
  let selectedCategoriesRef: ICategory[] = [];
  for (let i = 0; i < selectedCategoriesID.length; i++) {
    const catRef = await Category.findById(selectedCategoriesID[i]).exec();
    if (catRef) {
      selectedCategoriesRef.push(catRef);
    }
  }
  Subscription.findOne({ tokenID: req.params.tokenID })
    .exec()
    .then((sub) => {
      if (sub) {
        sub.categories = selectedCategoriesRef;
        sub.save();
      } else {
        const newSub: ISubscription = new Subscription({
          tokenID: req.params.tokenID,
          categories: selectedCategoriesRef,
        });
        newSub.save();
      }
    })
    .catch((err) => console.log(err));
  res.status(200);
};
