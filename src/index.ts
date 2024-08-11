import http from "http";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT: number = Number(process.env["PORT"]);
const server = http.createServer(app);

async function startServer() {
  //  start the server
  server.listen(PORT, () => {
    console.log("API gateway started on port:", PORT);
  });
}

startServer();
