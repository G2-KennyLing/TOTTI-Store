"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
class TokenService {
    createToken(token_params, callback) {
        const _token = new schema_1.default(token_params);
        _token.save(callback);
    }
    filterToken(query, callback) {
        schema_1.default.findOne(query, callback);
    }
}
exports.default = TokenService;
