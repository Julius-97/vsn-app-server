"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articles_1 = require("../controllers/articles");
const router = express_1.Router();
router.get('/', articles_1.getAllRecentArticles);
router.get('/Categories', articles_1.getCategories);
router.get('/:catName', articles_1.getArticlesByCategory);
exports.default = router;
