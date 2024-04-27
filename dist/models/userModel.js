"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: [String], required: true },
    birthday: { type: String, required: true },
    profileImg: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    mentorProfession: { type: String, required: false },
    mentorCanHelpWith: { type: [String], required: false },
    mentorDescription: { type: String, required: false },
    menteeProfession: { type: String, required: false },
    menteeNeedHelpWith: { type: [String], required: false },
    menteeDescription: { type: String, required: false },
    qualification: {
        university: { type: String, required: true },
    },
    links: {
        Github: { type: String, required: true },
        LinkedIn: { type: String, required: true },
    },
    connections: { type: [String], required: true },
    mentoringArchive: { type: [String], required: true },
    availableDays: { type: [String], required: true },
});
const User = mongoose_1.default.model('Users', userSchema);
exports.default = User;
