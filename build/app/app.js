"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_json_1 = __importDefault(require("./swagger.json"));
var body_parser_1 = __importDefault(require("body-parser"));
var routes_1 = __importDefault(require("./routes"));
var mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
var MONGO_URI = process.env.DB_URI || "mongodb://mongo:27017";
var MONGO_DB = process.env.DB_NAME || "notarize";
var NODE_ENV = process.env.NODE_ENV;
var app = express_1.default();
mongoose_1.default.connect(MONGO_URI + "/" + MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose_1.default.connection;
db.once("open", function () { return console.log("MongoDB connected successfully"); });
db.on("error", console.error.bind(console, "MongoDB connection error:"));
app.use(express_1.default.json());
app.enable("trust proxy");
app.use(cors_1.default());
app.use(body_parser_1.default.json());
if (NODE_ENV !== "production") {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
}
// error handler middleware
app.use(function (error, req, res, next) {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || "Internal Server Error"
        }
    });
});
routes_1.default(app);
exports.default = app;
