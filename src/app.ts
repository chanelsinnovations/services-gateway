import express, { Response, Request, Express } from "express";
import isValidClient from "./middleware/isValidClient";
import morgan from "morgan";
import { isValidToken } from "./middleware/isValidtoken";
import { routes } from "./routes";

const app: Express = express();

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Welcome to the API Gateway",
    });
  } catch (error: unknown) {
    console.log(error);
  }
});

app.use(routes);

app.use(isValidToken);

app.use(isValidClient);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    message: "Route Not found",
  });
});

app.use((err: any, req: Request, res: Response) => {
  if (err.response) {
    res.status(err.response.status).json({
      message: err.response?.data.message,
    });
    return;
  }
  res.status(500).json({ err });
});

export default app;
