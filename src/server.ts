import express from "express";
import cookieParser from "cookie-parser";
import router from "./src/router/router";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(3000, () => console.log("Server running on port 3000"));
