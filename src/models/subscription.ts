import { model, Schema, Model, Document, Types, set } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { ICategory } from './category';

set('useCreateIndex', true);

export interface ISubscription extends Document {
  tokenID: string;
  categories: ICategory[];
}

const SubscriptionSchema = new Schema({
  tokenID: { type: String, required: true, unique: true },
  categories: [{ type: Types.ObjectId, ref: 'Category' }],
});

SubscriptionSchema.plugin(uniqueValidator);

export const Subscription: Model<ISubscription> = model(
  'Subscription',
  SubscriptionSchema
);
