import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./config/Database.js";
import UsersRoute from "./routes/UsersRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

// Dev only
import bb from 'express-busboy';

dotenv.config();
const app = express();

app.use(cors({
    httpOnly: true,
    origin: 'http://localhost:3000'
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Dev only
bb.extend(app);

app.use(UsersRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT, () => {
    console.log('Server is up and running ...');
});

function initialize() {
    (async () => {
        await db.sync();
    })();
}

initialize();