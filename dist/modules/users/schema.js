"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("../../../node_modules/mongoose");
const model_1 = require("../common/model");
const Schema = mongoose.Schema;
const schema = new Schema({
    name: {
        type: {
            firstName: String,
            lastName: String,
        }
    },
    email: String,
    password: String,
    phoneNumber: String,
    gender: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    modificationNotes: [model_1.ModificationNote]
});
exports.default = mongoose.model('users', schema);
