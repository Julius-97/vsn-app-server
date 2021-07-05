"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
mongoose_1.set('useCreateIndex', true);
const SubscriptionSchema = new mongoose_1.Schema({
    tokenID: { type: String, required: true, unique: true },
    categories: [{ type: mongoose_1.Types.ObjectId, ref: 'Category' }],
});
SubscriptionSchema.plugin(mongoose_unique_validator_1.default);
exports.Subscription = mongoose_1.model('Subscription', SubscriptionSchema);
