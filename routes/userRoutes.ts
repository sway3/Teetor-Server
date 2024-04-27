import express from 'express';
import {
  getUserInfoController,
  getMentorsController,
  userSignUpController,
  userLogoutController,
  userProfileEditController,
} from '../controllers/userController';
import {
  getNotificationsController,
  getMentoringRequestController,
  controlMentoringRequestController,
} from '../controllers/notificationController';
import { getDashInfoController } from '../controllers/dashboardController';
import { googleOAuthController } from '../controllers/OAuthController';
import {
  authController,
  refreshTokenController,
} from '../controllers/userAuthController';
import {
  addNewEventController,
  editEventController,
  loadEventsController,
  mentoringRequestController,
  removeEventController,
} from '../controllers/mentoringController';
import {
  loadChatsController,
  loadMessageController,
  sendMessageController,
} from '../controllers/chatController';

const router = express.Router();

router.get('/dashboard', getDashInfoController);
router.post('/signup', userSignUpController);
router.get('/user', getUserInfoController);
router.put('/user/edit', userProfileEditController);
router.post('/logout', userLogoutController);
router.post('/user/mentors', getMentorsController);
router.get('/user/notifications', getNotificationsController);
router.post('/mentoring-request', mentoringRequestController);
router.get('/mentoring-request/:id', getMentoringRequestController);
router.patch('/mentoring-request/:id', controlMentoringRequestController);

// authentication, authorisation controllers
router.post('/auth', authController);
router.post('/google-oauth', googleOAuthController);
router.post('/refresh-token', refreshTokenController);

//chat
router.get('/chats', loadChatsController);
router.get('/messages/:id', loadMessageController);
router.post('/messages', sendMessageController);

router.post('/calendar', addNewEventController);
router.get('/calendar/:id', loadEventsController);
router.patch('/calendar/:sessionId/event/:eventId', removeEventController);
router.patch('/calendar/:sessionId/new-event/:eventId', editEventController);

export default router;
