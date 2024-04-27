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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMessages = exports.saveMessage = void 0;
// controllers/chatController.ts
const messageModel_1 = __importDefault(require("../models/messageModel"));
const saveMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield messageModel_1.default.create(data);
    }
    catch (error) {
        console.error('Error saving message:', error);
        throw new Error('Error saving message');
    }
});
exports.saveMessage = saveMessage;
const loadMessages = (recipientId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messageModel_1.default.find({
            $or: [
                { recipientId, senderId },
                { recipientId: senderId, senderId: recipientId }
            ]
        }).sort('timestamp');
        return messages;
    }
    catch (error) {
        console.error('Error loading messages:', error);
        throw new Error('Error loading messages');
    }
});
exports.loadMessages = loadMessages;
