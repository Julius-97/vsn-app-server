"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const mongoose_1 = __importDefault(require("mongoose"));
const node_cron_1 = __importDefault(require("node-cron"));
const articles_1 = __importDefault(require("./routes/articles"));
const pushNotifications_1 = __importDefault(require("./routes/pushNotifications"));
const saveArticlesFromXML_1 = require("./helpers/saveArticlesFromXML");
const article_1 = require("./models/article");
const pushNotificationHandler_1 = require("./helpers/pushNotificationHandler");
const app = express_1.default();
const fetchArticlesTask = node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const lastArticles = yield article_1.Article.find().sort({ date: -1 }).limit(5).exec();
    yield saveArticlesFromXML_1.saveArticlesByXML('https://www.vallesabbianews.it/it.xml');
    const lastUpdatedArticles = yield article_1.Article.find()
        .sort({ date: -1 })
        .limit(5)
        .populate('categories', 'name')
        .exec();
    const newArticles = lastUpdatedArticles.filter((lastUpdArt) => {
        return !lastArticles.map((a) => a.title).includes(lastUpdArt.title);
    });
    if (newArticles.length > 0) {
        console.log(`${newArticles.length} new articles found`);
        pushNotificationHandler_1.triggerNotifications(newArticles);
    }
    console.log('Updating last articles...');
}));
fetchArticlesTask.stop();
app.use(body_parser_1.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With ,Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});
app.use('/articles', articles_1.default);
app.use('/pushNotifications', pushNotifications_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
mongoose_1.default
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wee0h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    /*populateDB().then(() => {
      app.listen(3000);
      fetchArticlesTask.start();
    });*/
    app.listen(3000);
    fetchArticlesTask.start();
})
    .catch((err) => console.log(err.message));
