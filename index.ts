import express from "express";
import dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

import router from "./src/router";

const app = express();

dotenv.config({ path: "./config.env" });

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Set mongoose to use native JS promise
mongoose.Promise = Promise;

mongoose
  .connect(process.env.DATABASE as string)
  .then(() => console.log("DB connection sucessfull!"));
mongoose.connection.on("error", (err: Error) => console.log(err));

app.use("/", router());
