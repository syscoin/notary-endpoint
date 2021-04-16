"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var app_1 = __importDefault(require("./app"));
var _a = process.env.PORT, PORT = _a === void 0 ? 8081 : _a;
http_1.default
    .createServer(app_1.default)
    .listen(PORT, function () { return console.log("Listening on port " + PORT); });
