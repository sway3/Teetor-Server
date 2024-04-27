"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
router.get('/users/:id', userController_1.getUserController);
router.get('/users/:id/mentors', userController_1.getMentorsController);
router.get('/users/:id/notifications', notificationController_1.getNotificationsController);
router.post('/mentoring-request', notificationController_1.mentoringRequestController);
router.get('/mentoring-request/:id', notificationController_1.getMentoringRequestController);
router.patch('/mentoring-request/:id', notificationController_1.controlMentoringRequestController);
exports.default = router;
