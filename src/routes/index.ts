import { Router } from "express";
import { authRoutes } from "./auth.router";

const router = Router();

router.use(authRoutes);

export const routes = router;
