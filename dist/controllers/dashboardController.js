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
exports.getDashInfoController = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const mentoringSessionModel_1 = __importDefault(require("../models/mentoringSessionModel"));
const getUserInfo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield userModel_1.default.findById(id);
    return userInfo;
});
const getNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notificationModel_1.default.find({ recipientId: id });
    return notification;
});
const getMentoringSessions = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const mentoringSessions = yield mentoringSessionModel_1.default.find({
        $or: [
            { 'participants.mentorId': id },
            { 'participants.menteeId': id }
        ]
    });
    return mentoringSessions;
});
const getDashInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
});
exports.getDashInfoController = getDashInfoController;
