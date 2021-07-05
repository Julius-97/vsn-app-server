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
exports.saveArticlesByXML = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
const mongoose_1 = require("mongoose");
const article_1 = require("../models/article");
const category_1 = require("../models/category");
const getImageURL = (artURL) => __awaiter(void 0, void 0, void 0, function* () {
    // fetch imageURL from article link
    let imageURL;
    const articlePage = yield node_fetch_1.default(artURL);
    const APtext = yield articlePage.text();
    const $ = cheerio_1.default.load(APtext);
    imageURL = $("meta[property='og:image']").attr('content');
    if (imageURL)
        return imageURL;
    else
        return '';
});
const saveArticlesByXML = (xmlURL) => __awaiter(void 0, void 0, void 0, function* () {
    //save all articles from XML to the DB
    const articles = [];
    try {
        const res = yield node_fetch_1.default(xmlURL);
        if (!res.ok) {
            throw new mongoose_1.Error('Something went wrong!');
        }
        const resText = yield res.text();
        const parsedXML = fast_xml_parser_1.parse(resText);
        for (let el of parsedXML.rss.channel.item) {
            // loop trough items (articles)
            if (el.title && el.title.length > 0) {
                let category = [];
                let artCategories = [];
                let imageURL = yield getImageURL(el.link);
                if (el.category) {
                    category = el.category.split(',').map((cat) => cat.trim()); //get categories name in an array
                    for (const str of category) {
                        // loop through categories names in order to link categories objects
                        const artCatRef = yield category_1.Category.findOne({
                            name: str,
                        }).exec();
                        if (artCatRef)
                            artCategories.push(artCatRef); //add category only if exists
                    }
                }
                let art = new article_1.Article({
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
                    .catch((err) => {
                    if (err.name !== 'ValidationError')
                        console.log(err.name);
                });
            }
        }
    }
    catch (err) {
        console.log('Some errors during fetching occurred', err.message);
    }
});
exports.saveArticlesByXML = saveArticlesByXML;
