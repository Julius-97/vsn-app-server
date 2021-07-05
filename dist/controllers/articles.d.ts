import { RequestHandler } from 'express';
export declare const getAllRecentArticles: RequestHandler;
export declare const getRecentArticlesFiltered: RequestHandler;
export declare const getCategories: RequestHandler;
export declare const getArticlesByCategory: RequestHandler<{
    catName: string;
}>;
