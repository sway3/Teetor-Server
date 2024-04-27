"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
const chatSchema = new mongoose_1.default.Schema({
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
    readStatus: { type: Boolean, required: true },
});
const Chat = mongoose_1.default.model('Chats', chatSchema);
exports.default = Chat;
