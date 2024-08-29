import express, { Request, Response, NextFunction } from "express";
import { ENV } from "./config";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger";
import apiV1Routes from "./routes/v1";

const app = express();

const port = ENV.PORT || 5500;

const allowedOrigins: Array<string> = [
  ENV.FE_BASE_URL as string,
  // CORS allow use of swagger on local environment
  ENV.IS_PROD ? "" : `http://localhost:${port}`,
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      (typeof origin === "string" && allowedOrigins.includes(origin)) ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // this header is needed when using http and not https
  res.header("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/v1", apiV1Routes);
app.use(notFound);
app.use(errorHandler);

export default app
