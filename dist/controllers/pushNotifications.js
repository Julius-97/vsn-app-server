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
exports.subscribe = exports.getSubscriptionInfo = void 0;
const category_1 = require("../models/category");
const subscription_1 = require("../models/subscription");
const getSubscriptionInfo = (req, res, next) => {
    subscription_1.Subscription.findOne({ tokenID: req.params.tokenID })
        .populate('categories', 'name')
        .exec()
        .then((sub) => {
        if (sub) {
            res.status(200).json({
                tokenID: sub.tokenID,
                categories: sub.categories,
            });
        }
        else {
            res.status(404).json({ msg: 'subscription not found!' });
        }
    });
};
exports.getSubscriptionInfo = getSubscriptionInfo;
const subscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedCategoriesID = req.body.categories;
    let selectedCategoriesRef = [];
    for (let i = 0; i < selectedCategoriesID.length; i++) {
        const catRef = yield category_1.Category.findById(selectedCategoriesID[i]).exec();
        if (catRef) {
            selectedCategoriesRef.push(catRef);
        }
    }
    subscription_1.Subscription.findOne({ tokenID: req.params.tokenID })
        .exec()
        .then((sub) => {
        if (sub) {
            sub.categories = selectedCategoriesRef;
            sub.save();
        }
        else {
            const newSub = new subscription_1.Subscription({
                tokenID: req.params.tokenID,
                categories: selectedCategoriesRef,
            });
            newSub.save();
        }
    })
        .catch((err) => console.log(err));
    res.status(200);
});
exports.subscribe = subscribe;
