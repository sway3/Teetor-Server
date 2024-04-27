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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandlers = void 0;
const chatController_1 = require("../controllers/chatController");
const registerChatHandlers = (io, socket) => {
    socket.on('join_room', (userId) => {
        console.log(`User with ID ${userId} joining room: ${userId}`);
        socket.join(userId); // User joins a room named after their userID
    });
    socket.on('send_message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Save the message to the database
            const savedMessage = yield (0, chatController_1.saveMessage)(data);
            // Emit the saved message back to the sender for immediate feedback
            socket.emit('receive_message', savedMessage);
            // Also, emit the message to the recipient's room (identified by recipientId)
            io.to(data.recipientId).emit('receive_message', savedMessage);
        }
        catch (error) {
            socket.emit('error_saving_message', { error: error });
        }
    }));
};
exports.registerChatHandlers = registerChatHandlers;
