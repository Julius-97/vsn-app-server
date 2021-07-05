import { Model, Document } from 'mongoose';
import { IArticle } from './article';
export interface ICategory extends Document {
    name: string;
    linkXML: string;
    articles: IArticle[];
}
export declare const Category: Model<ICategory>;
