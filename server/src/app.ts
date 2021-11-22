// src/app.ts
import * as dotenv from "dotenv";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import { sequelize } from "./models";
import User from "./models/user.model";
import indexRouter from "./routes";

dotenv.config();
// * APP VARIABLES
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
const HOST: string = process.env.HOST || "localhost";
const app: express.Application = express();

// * APP CONFIGURATION: middleware
app.use(cors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Request occur! ${req.method}, ${req.url}`);
    next();
});

// * SWAGGER API DOCS SETTING
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "GongC API",
            description: "GongC API 문서",
            contact: {
                name: "Jin Lee",
            },
            servers: ["https://localhost:" + PORT.toString()],
            version: "0.0.1",
        },
    },
    apis: [
        __dirname + "/*.js",
        __dirname + "/*.ts",
        __dirname + "/controllers/*.js",
        __dirname + "/controllers/*.ts",
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));

// * ROUTER SETTING
app.use(indexRouter);

// get
app.get("/", (req: Request, res: Response) => {
    res.send("hello express");
});

app.get("/test", (req: Request, res: Response) => {
    // email password nickname rasp_token android_token
    res.status(200).send({ done: true });
    // res.status(400).send({ done: false });
});

// 5000 포트로 서버 실행
app.listen(PORT, HOST, async () => {
    console.log(`server on: listening on ${HOST}:${PORT}`);
    // sequelize-db connection test
    await sequelize
        .sync({})
        .then(async () => {
            console.log("seq connection success");
        })
        .catch((e) => {
            console.log("seq ERROR: ", e);
        });
});
