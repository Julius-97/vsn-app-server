import { RequestHandler } from 'express';

import { Article } from '../models/article';
import { Category } from '../models/category';

export const getAllRecentArticles: RequestHandler = (req, res, next) => {
  let fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 2); // from 48 hours ago
  Article.find({ date: { $gte: fromDate } })
    .populate('categories', 'name')
    .exec()
    .then((arts) => {
      res.status(200).json({
        articles: arts.sort((a, b) => b.date.getTime() - a.date.getTime()),
      });
    });
};

export const getRecentArticlesFiltered: RequestHandler = (req, res, next) => {
  let fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 2); // since 48 hours ago
  Article.find({ date: { $gte: fromDate } })
    .populate('categories', 'name')
    .exec()
    .then((arts) => {
      res.status(200).json({
        articles: arts.sort((a, b) => b.date.getTime() - a.date.getTime()),
      });
    });
};

export const getCategories: RequestHandler = (req, res, next) => {
  Category.find({}, 'name')
    .exec()
    .then((cats) => {
      res.status(200).json({
        categories: cats.sort((a, b) => a.name.localeCompare(b.name)),
      });
    })
    .catch((err) => res.status(400).json({ errMsg: err.message }));
};

export const getArticlesByCategory: RequestHandler<{ catName: string }> = (
  req,
  res,
  next
) => {
  Category.findOne({ name: req.params.catName })
    .populate('articles', '-categories')
    .exec()
    .then((cat) => {
      if (cat) {
        res.status(200).json({
          articles: cat.articles.sort(
            (a, b) => b.date.getTime() - a.date.getTime()
          ),
        });
      } else {
        res.status(404).json({ msg: 'category not found!' });
      }
    });
};
