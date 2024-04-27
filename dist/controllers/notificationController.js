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
exports.controlMentoringRequestController = exports.getMentoringRequestController = exports.mentoringRequestController = exports.getNotificationsController = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const mentoringSessionModel_1 = __importDefault(require("../models/mentoringSessionModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getNotificationsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    console.log('userId: ', userId);
    try {
        const notifications = yield notificationModel_1.default.find({ 'recipientId': userId });
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getNotificationsController = getNotificationsController;
const mentoringRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId, menteeId } = req.body;
    try {
        const notification = new notificationModel_1.default({
            recipientId: mentorId,
            senderId: menteeId,
            type: 'mentoring-request',
            status: 'pending',
            message: 'You have a new mentoring request',
            timestamp: new Date().toISOString()
        });
        const savedNotification = yield notification.save();
        res.status(201).json(savedNotification);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.mentoringRequestController = mentoringRequestController;
const getMentoringRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationRequestId = req.params.id;
    try {
        const notification = yield notificationModel_1.default.findById(notificationRequestId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        const menteeInfo = yield userModel_1.default.findById(notification.senderId);
        return res.status(200).json({ notification, menteeInfo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMentoringRequestController = getMentoringRequestController;
const controlMentoringRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationId = req.params.id;
    const { status } = req.body;
    try {
        const notification = yield notificationModel_1.default.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        if (status === 'accepted') {
            const mentoringSession = new mentoringSessionModel_1.default({
                participants: {
                    mentorId: notification.recipientId,
                    menteeId: notification.senderId
                },
                status: 'inProgress',
                startDate: new Date().toISOString(),
                endDate: null
            });
            const savedMentoringSession = yield mentoringSession.save();
            const resultNotification = new notificationModel_1.default({
                recipientId: notification.senderId,
                senderId: notification.recipientId,
                type: 'mentoring-request-result',
                status: 'accepted',
                message: `Your mentoring request to ${notification.recipientId} has been accepted. Start off your session by chatting to your mentor!`,
                timestamp: new Date().toISOString()
            });
            const savedResultNotification = yield resultNotification.save();
        }
        return res.status(200).json(notification);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.controlMentoringRequestController = controlMentoringRequestController;
