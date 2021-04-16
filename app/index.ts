import http from "http";
import app from "./app";

const { PORT = 8081 } = process.env;

http
  .createServer(app)
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
