import { Category } from '../models/category';
import { Article } from '../models/article';
import { saveArticlesByXML } from './saveArticlesFromXML';
import { CATEGORIES } from '../data/CATEGORIES';

export const populateDB = async () => {
  await initializeCategories();
  const cats = await Category.find({}).exec();
  await Article.collection.drop();
  for (let cat of cats) {
    console.log('searching for ', cat.name);
    await saveArticlesByXML(cat.linkXML);
    console.log(cat.name, ' Done!');
  }
};

const initializeCategories = async () => {
  await Category.collection.drop();
  for (let cat of CATEGORIES) {
    await Category.create({
      name: cat.name,
      linkXML: cat.linkXML,
      articles: [],
    });
  }
};
