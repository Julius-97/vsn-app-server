"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
mongoose_1.set('useCreateIndex', true); //to hide deprecation warning by unique-validator
const ArticleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    categories: [{ type: mongoose_1.Types.ObjectId, ref: 'Category' }],
    date: { type: Date, required: true },
    link: { type: String, required: true, unique: true },
    imageURL: { type: String, required: true },
});
ArticleSchema.plugin(mongoose_unique_validator_1.default);
exports.Article = mongoose_1.model('Article', ArticleSchema);
