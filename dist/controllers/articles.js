"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticlesByCategory = exports.getCategories = exports.getRecentArticlesFiltered = exports.getAllRecentArticles = void 0;
const article_1 = require("../models/article");
const category_1 = require("../models/category");
const getAllRecentArticles = (req, res, next) => {
    let fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 2); // from 48 hours ago
    article_1.Article.find({ date: { $gte: fromDate } })
        .populate('categories', 'name')
        .exec()
        .then((arts) => {
        res.status(200).json({
            articles: arts.sort((a, b) => b.date.getTime() - a.date.getTime()),
        });
    });
};
exports.getAllRecentArticles = getAllRecentArticles;
const getRecentArticlesFiltered = (req, res, next) => {
    let fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 2); // since 48 hours ago
    article_1.Article.find({ date: { $gte: fromDate } })
        .populate('categories', 'name')
        .exec()
        .then((arts) => {
        res.status(200).json({
            articles: arts.sort((a, b) => b.date.getTime() - a.date.getTime()),
        });
    });
};
exports.getRecentArticlesFiltered = getRecentArticlesFiltered;
const getCategories = (req, res, next) => {
    category_1.Category.find({}, 'name')
        .exec()
        .then((cats) => {
        res.status(200).json({
            categories: cats.sort((a, b) => a.name.localeCompare(b.name)),
        });
    })
        .catch((err) => res.status(400).json({ errMsg: err.message }));
};
exports.getCategories = getCategories;
const getArticlesByCategory = (req, res, next) => {
    category_1.Category.findOne({ name: req.params.catName })
        .populate('articles', '-categories')
        .exec()
        .then((cat) => {
        if (cat) {
            res.status(200).json({
                articles: cat.articles.sort((a, b) => b.date.getTime() - a.date.getTime()),
            });
        }
        else {
            res.status(404).json({ msg: 'category not found!' });
        }
    });
};
exports.getArticlesByCategory = getArticlesByCategory;
