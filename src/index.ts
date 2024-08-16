import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { DBConnection } from "./services/db";

dotenv.config();

const PORT: number = Number(process.env["PORT"]);
const server = http.createServer(app);

async function startServer() {
  DBConnection.connectDB();
  //  start the server
  server.listen(PORT, () => {
    console.log("API gateway started on port:", PORT);
  });
}

startServer();
