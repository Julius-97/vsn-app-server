import { Router } from 'express';

import {
  getAllRecentArticles,
  getArticlesByCategory,
  getCategories,
} from '../controllers/articles';

const router = Router();

router.get('/', getAllRecentArticles);

router.get('/Categories', getCategories);

router.get('/:catName', getArticlesByCategory);

export default router;
