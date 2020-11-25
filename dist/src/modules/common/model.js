"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseStatusCodes = exports.ModificationNote = void 0;
exports.ModificationNote = {
    modifiedOn: Date,
    modifiedBy: String,
    modificationNote: String
};
var responseStatusCodes;
(function (responseStatusCodes) {
    responseStatusCodes[responseStatusCodes["success"] = 200] = "success";
    responseStatusCodes[responseStatusCodes["badRequest"] = 400] = "badRequest";
    responseStatusCodes[responseStatusCodes["internalServerError"] = 500] = "internalServerError";
})(responseStatusCodes = exports.responseStatusCodes || (exports.responseStatusCodes = {}));
