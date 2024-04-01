import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/modules/Error/globalErrorHandler";
import httpStatus from "http-status";

const app: Application = express();
app.use(cookieParser())

// PARSER
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Hello  Assignment-8!",
  });
});

app.use("/api", router);

app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "API NOT FOUND!",
      error: {
          path: req.originalUrl,
          message: "Your requested path is not found!"
      }
  })
})




export default app;
