"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    recipientId: { type: String, required: true },
    senderId: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
});
const Notification = mongoose_1.default.model('Notifications', notificationSchema);
exports.default = Notification;
