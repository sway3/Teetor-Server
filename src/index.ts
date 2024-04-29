import mongoose from "mongoose";

import config from "./config";
import dotenv from "dotenv";

import { server, app } from "../socket/socket";

dotenv.config();

const PORT = process.env.PORT || 3001;

const mongoURI: string = config.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));

require("dotenv").config();

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
