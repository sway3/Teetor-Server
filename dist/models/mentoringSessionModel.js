"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const calendarSchema = new mongoose_1.default.Schema({
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
});
const mentoringSessionSchema = new mongoose_1.default.Schema({
    participants: {
        mentorId: { type: String, required: true },
        menteeId: { type: String, required: true },
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: false },
    status: { type: String, required: true },
    calendar: { type: [calendarSchema], required: false },
});
const MentoringSession = mongoose_1.default.model('MentoringInfo', mentoringSessionSchema);
exports.default = MentoringSession;
