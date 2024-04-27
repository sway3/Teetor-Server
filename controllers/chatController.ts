// controllers/chatController.ts
import Message from '../models/messageModel';
import { Request, Response } from 'express';
import { getUserId } from '../utils/authFunctions';
import Chat from '../models/chatModel';
import { getRecicipientSocketId, io } from '../socket/socket';
import MentoringSession from '../models/mentoringSessionModel';
import { chatSuggestController } from './gptController';

export const loadMessageController = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const userId = getUserId(accessToken);
  const chatId = req.params.id;

  console.log(chatId);

  try {
    const messages = await Message.find({ chatId: chatId })
      .populate('senderId', 'firstName')
      .lean();

    if (messages.length !== 0) {
      res.status(200).json({ messages });
    } else {
      const chat = await Chat.findById(chatId);

      const mentoringSession: any = await MentoringSession.findOne({
        $or: [
          { 'participants.mentorId': { $in: chat?.participants } },
          { 'participants.menteeId': { $in: chat?.participants } },
        ],
      });

      const userIsMentor = mentoringSession.participants.mentorId === userId;

      const chatSuggestionResult = await chatSuggestController(
        mentoringSession.mentorInfo,
        mentoringSession.menteeInfo
      );

      const chatSuggestion = userIsMentor
        ? chatSuggestionResult.mentor
        : chatSuggestionResult.mentee;

      res.status(200).json({ messages, chatSuggestion });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Error occurred in load messages controller');
  }
};

export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const { content, chatId } = req.body;
    const accessToken = req.cookies.accessToken;
    const userId = getUserId(accessToken);

    const chat = await Chat.findById(chatId);

    if (chat) {
      const recipientId = chat?.participants.filter(
        (p: any) => p._id !== userId
      )[0];

      const newMessage = new Message({
        senderId: userId,
        recipientId: recipientId,
        chatId: chatId,
        content: content,
        timestamp: new Date().toISOString(),
        readStatus: false,
      });

      await newMessage.save();

      console.log(recipientId);
      const recipientSocketId = getRecicipientSocketId(recipientId);

      const messageFormat = await newMessage.populate('senderId', 'firstName');

      io.emit('newMessage', messageFormat);

      res.status(201).send('Message sent successful');
    }
  } catch (error) {
    res.status(500).json(`Error occurred in send message controller: ${error}`);
  }
};

export const loadChatsController = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const userId = getUserId(accessToken);

  try {
    const chats = await Chat.find({ participants: userId });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json('database error');
  }
};
