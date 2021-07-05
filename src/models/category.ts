import { model, Schema, Model, Document, Types } from 'mongoose';

import { IArticle } from './article';

export interface ICategory extends Document {
  name: string;
  linkXML: string;
  articles: IArticle[];
}

const CategorySchema = new Schema({
  name: { type: String, required: true },
  linkXML: { type: String, required: true },
  articles: [{ type: Types.ObjectId, ref: 'Article' }],
});

export const Category: Model<ICategory> = model('Category', CategorySchema);
