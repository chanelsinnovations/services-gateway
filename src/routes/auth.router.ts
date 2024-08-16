import express, {
  Response,
  Request,
  Express,
  RouterOptions,
  Router,
} from "express";
import { AuthController } from "../controller/auth.controller";
const router = Router();

router.post("/auth/login", AuthController.login);

export const authRoutes = router;
