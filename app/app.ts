import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import bodyParser from "body-parser";
import routes from "./routes";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.DB_URI || "mongodb://mongo:27017";
const MONGO_DB = process.env.DB_NAME || "notarize";
const { NODE_ENV } = process.env;

const app: Application = express();

mongoose.connect(`${MONGO_URI}/${MONGO_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once("open", () => console.log("MongoDB connected successfully"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(express.json());
app.enable("trust proxy");
app.use(cors());
app.use(bodyParser.json());

if (NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// error handler middleware
app.use((error: any, req: any, res: any, next: any) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error"
    }
  });
});

routes(app);

export default app;
