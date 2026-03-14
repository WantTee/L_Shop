import dotenv from "dotenv";
dotenv.config({
    path: "./src/.env"
  });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/router";



const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));  
app.use(express.json());
app.use(cookieParser());
console.log("Router loaded");
app.use(router);


app.listen(3000, () => console.log("Server running on port 3000"));
