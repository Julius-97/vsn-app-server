import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cron from 'node-cron';

import articlesRoutes from './routes/articles';
import pushNotificationsRoutes from './routes/pushNotifications';
import { saveArticlesByXML } from './helpers/saveArticlesFromXML';
import { populateDB } from './helpers/initializeDB';
import { Article } from './models/article';
import { triggerNotifications } from './helpers/pushNotificationHandler';

const app = express();

const fetchArticlesTask = cron.schedule('* * * * *', async () => {
  const lastArticles = await Article.find().sort({ date: -1 }).limit(5).exec();
  await saveArticlesByXML('https://www.vallesabbianews.it/it.xml');
  const lastUpdatedArticles = await Article.find()
    .sort({ date: -1 })
    .limit(5)
    .populate('categories', 'name')
    .exec();
  const newArticles = lastUpdatedArticles.filter((lastUpdArt) => {
    return !lastArticles.map((a) => a.title).includes(lastUpdArt.title);
  });
  if (newArticles.length > 0) {
    console.log(`${newArticles.length} new articles found`);
    triggerNotifications(newArticles);
  }
  console.log('Updating last articles...');
});

fetchArticlesTask.stop();

app.use(json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With ,Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/articles', articlesRoutes);

app.use('/pushNotifications', pushNotificationsRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wee0h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    /*populateDB().then(() => {
      app.listen(3000);
      fetchArticlesTask.start();
    });*/
    app.listen(3000);
    fetchArticlesTask.start();
  })
  .catch((err) => console.log(err.message));
