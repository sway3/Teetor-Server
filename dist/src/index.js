"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const config_1 = __importDefault(require("./config"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const messageModel_1 = __importDefault(require("../models/messageModel"));
const app = (0, express_1.default)();
const PORT = 3001;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    }
});
const mongoURI = config_1.default.MONGO_URI;
mongoose_1.default.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Load existing messages and emit to the newly connected client
    messageModel_1.default.find().sort({ timestamp: 1 }).then(messages => {
        socket.emit('initial_messages', messages);
    });
    socket.on('send_message', (data) => {
        if (!data.content.trim()) {
            // Prevent sending empty messages
            return;
        }
        const newMessage = new messageModel_1.default({
            senderId: data.senderId,
            recipientId: data.recipientId,
            content: data.content,
            timestamp: new Date() // Ensure the timestamp is set when creating a message
        });
        newMessage.save().then(savedMessage => {
            io.emit('new_message', savedMessage); // Broadcast to all clients
        }).catch(err => console.error('Error saving message:', err));
    });
});
const cors = require('cors');
app.use(cors());
app.use(express_1.default.json());
app.use(userRoutes_1.default);
app.get('/api/test', (req, res) => {
    res.json({ message: "Success! The server is responding." });
});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
