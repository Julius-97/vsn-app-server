import { parse } from 'fast-xml-parser';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { Error } from 'mongoose';

import { Article, IArticle } from '../models/article';
import { Category, ICategory } from '../models/category';

interface fetchArt {
  (fileURL: string): Promise<void>;
}

type artsXMLObject = {
  rss: {
    channel: {
      item: {
        title: string | null;
        category: string | null;
        guid: string;
        pubDate: string;
        link: string;
      }[];
      lastBuildDate: string;
    };
  };
};

interface fetchIMG {
  (fileURL: string): Promise<string>;
}

const getImageURL: fetchIMG = async (artURL) => {
  // fetch imageURL from article link
  let imageURL: string | undefined;

  const articlePage = await fetch(artURL);

  const APtext = await articlePage.text();

  const $ = cheerio.load(APtext);

  imageURL = $("meta[property='og:image']").attr('content');

  if (imageURL) return imageURL;
  else return '';
};

export const saveArticlesByXML: fetchArt = async (xmlURL) => {
  //save all articles from XML to the DB
  const articles: IArticle[] = [];

  try {
    const res = await fetch(xmlURL);

    if (!res.ok) {
      throw new Error('Something went wrong!');
    }

    const resText: string = await res.text();
    const parsedXML: artsXMLObject = parse(resText);

    for (let el of parsedXML.rss.channel.item) {
      // loop trough items (articles)
      if (el.title && el.title.length > 0) {
        let category: string[] = [];
        let artCategories: ICategory[] = [];
        let imageURL: string = await getImageURL(el.link);
        if (el.category) {
          category = el.category.split(',').map((cat) => cat.trim()); //get categories name in an array
          for (const str of category) {
            // loop through categories names in order to link categories objects
            const artCatRef = await Category.findOne({
              name: str,
            }).exec();
            if (artCatRef) artCategories.push(artCatRef); //add category only if exists
          }
        }
        let art = new Article({
          title: el.title,
          categories: artCategories,
          date: new Date(el.pubDate),
          link: el.link,
          imageURL,
        });
        art
          .save()
          .then((article) => {
            // add articles reference to each category
            for (let artCat of art.categories) {
              artCat.articles.push(article);
              artCat.save();
            }
          })
          .catch((err: Error) => {
            if (err.name !== 'ValidationError') console.log(err.name);
          });
      }
    }
  } catch (err) {
    console.log('Some errors during fetching occurred', err.message);
  }
};
