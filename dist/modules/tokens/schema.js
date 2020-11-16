"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
    _userId: String,
    token: String,
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});
exports.default = mongoose.model('tokens', tokenSchema);
