import { Model, Document } from 'mongoose';
import { ICategory } from './category';
export interface IArticle extends Document {
    title: string;
    categories: ICategory[];
    date: Date;
    link: string;
    imageURL: string;
}
export declare const Article: Model<IArticle>;
