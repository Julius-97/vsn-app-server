"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    linkXML: { type: String, required: true },
    articles: [{ type: mongoose_1.Types.ObjectId, ref: 'Article' }],
});
exports.Category = mongoose_1.model('Category', CategorySchema);
