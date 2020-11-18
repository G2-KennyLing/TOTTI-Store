"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
class UserService {
    createUser(userParams, callback) {
        const _session = new schema_1.default(userParams);
        _session.save(callback);
    }
    filterUser(query, callback) {
        schema_1.default.findOne(query, callback);
    }
    updateUser(userParams, callback) {
        const query = { _id: userParams._id };
        schema_1.default.findOneAndUpdate(query, userParams, callback);
    }
    deleteUser(_id, callback) {
        const query = { _id: _id };
        schema_1.default.deleteOne(query, callback);
    }
}
exports.default = UserService;
