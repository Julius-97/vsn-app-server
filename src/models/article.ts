import { model, Schema, Model, Document, Types, set } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { ICategory } from './category';

set('useCreateIndex', true); //to hide deprecation warning by unique-validator

export interface IArticle extends Document {
  title: string;
  categories: ICategory[];
  date: Date;
  link: string;
  imageURL: string;
}

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  categories: [{ type: Types.ObjectId, ref: 'Category' }],
  date: { type: Date, required: true },
  link: { type: String, required: true, unique: true },
  imageURL: { type: String, required: true },
});

ArticleSchema.plugin(uniqueValidator);

export const Article: Model<IArticle> = model('Article', ArticleSchema);
