import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieparser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import {io, app, server} from "./lib/socket.js"
import path from "path";

dotenv.config({path: "./src/.env"});
const __dirname = path.resolve();


const port = process.env.PORT || 8000;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.raw({ limit: '50mb' }));
app.use(bodyParser.text({ limit: '50mb' }));
app.use(cookieparser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  connectDB();
})