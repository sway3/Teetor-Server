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
exports.getMentorsController = exports.getUserController = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const mentoringSessionModel_1 = __importDefault(require("../models/mentoringSessionModel"));
const userUtility_1 = require("../utils/userUtility");
const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    console.log('userId: ', userId);
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // find notification of this user
        const notifications = yield notificationModel_1.default.find({ recipientId: userId });
        const mentoringSessions = yield mentoringSessionModel_1.default.find({
            $or: [
                { 'participants.mentorId': userId },
                { 'participants.menteeId': userId }
            ]
        });
        res.status(200).json({ user, notifications, mentoringSessions });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserController = getUserController;
const getMentorsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const mentors = yield userModel_1.default.find({ role: 'mentor' });
        console.log(mentors);
        const menteeNeedHelpWith = user.menteeNeedHelpWith;
        const activeSessions = yield mentoringSessionModel_1.default.find({ 'participants.menteeId': userId });
        const activeMentors = activeSessions.map((session) => session.participants.mentorId);
        console.log('menteeNeedHelpWith: ', menteeNeedHelpWith);
        const filteredMentors = mentors.filter((mentor) => {
            if (activeMentors.includes(mentor._id.toString())) {
                return false;
            }
            let mentorCanHelpWith = mentor.mentorCanHelpWith;
            console.log('mentorCanHelpWith: ', mentorCanHelpWith);
            const mentorAvailableDays = mentor.availableDays;
            const menteeAvailableDays = user.availableDays;
            if ((0, userUtility_1.hasDuplicates)(menteeNeedHelpWith, mentorCanHelpWith) && (0, userUtility_1.hasDuplicates)(mentorAvailableDays, menteeAvailableDays)) {
                return true;
            }
            return false;
        });
        res.status(200).json(filteredMentors);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMentorsController = getMentorsController;
