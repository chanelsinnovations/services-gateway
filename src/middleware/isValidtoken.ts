import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export const isValidToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(401).json({
        message: "Authorization token not passed.",
      });
    }

    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authorization token not passed.",
      });
    }

    const jwtSecret = process.env.JWT_TOKEN;
    if (typeof jwtSecret !== "string" || jwtSecret.length === 0) {
      throw new Error(
        "JWT_TOKEN is not properly defined in environment variables"
      );
    }

    // verify the jwt token
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(403).json({
            message: "Invalid token",
          });
        } else if (err.name === "TokenExpiredError") {
          return res.status(403).json({
            message: "Token expired",
          });
        } else {
          return res.status(403).json({
            message: err.message,
          });
        }
      }

      if (!data || typeof data === "string" || !("_id" in data)) {
        return res.status(400).json({
          message: "JWT missing claims",
        });
      }

      next();
    });
  } catch (error) {
    next(error);
  }
};
