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
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateDB = void 0;
const category_1 = require("../models/category");
const article_1 = require("../models/article");
const saveArticlesFromXML_1 = require("./saveArticlesFromXML");
const CATEGORIES_1 = require("../data/CATEGORIES");
const populateDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeCategories();
    const cats = yield category_1.Category.find({}).exec();
    yield article_1.Article.collection.drop();
    for (let cat of cats) {
        console.log('searching for ', cat.name);
        yield saveArticlesFromXML_1.saveArticlesByXML(cat.linkXML);
        console.log(cat.name, ' Done!');
    }
});
exports.populateDB = populateDB;
const initializeCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    yield category_1.Category.collection.drop();
    for (let cat of CATEGORIES_1.CATEGORIES) {
        yield category_1.Category.create({
            name: cat.name,
            linkXML: cat.linkXML,
            articles: [],
        });
    }
});
