import { Request, Response, NextFunction } from "express";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../services/db";

export class AuthController {
  constructor() {}

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!password) {
        return res.status(400).json({
          message: "Password is required.",
        });
      }

      if (!username) {
        return res.status(400).json({
          message: "Username is required.",
        });
      }

      // find user
      const [user, fields] = await pool
        .promise()
        .query<RowDataPacket[]>(
          `SELECT * FROM users WHERE users.username = ?`,
          [username]
        );

      if (user.length == 0) {
        return res.status(404).json({
          message: "User doesn't exist",
        });
      }

      const decryptPassword = await bcrypt.compare(password, user[0].password);

      if (!decryptPassword) {
        return res.status(401).json({
          message: "Incorrect password or username.",
        });
      }

      const jwtSecret = process.env.JWT_TOKEN;
      if (typeof jwtSecret !== "string" || jwtSecret.length === 0) {
        throw new Error(
          "JWT_TOKEN is not properly defined in environment variables"
        );
      }

      const signToken = jwt.sign(
        {
          _id: user[0].id,
        },
        jwtSecret,
        {
          expiresIn: "24h",
        }
      );

      // Verify the token immediately after generation
      // try {
      //   const verified = jwt.verify(signToken, jwtSecret);
      //   console.log("Verified token immediately after generation:", verified);
      // } catch (verifyError) {
      //   console.error(
      //     "Error verifying token immediately after generation:",
      //     verifyError
      //   );
      // }

      res.status(200).json({
        message: "success",
        data: {
          token: signToken,
          username: user[0].username,
          userid: user[0].id,
          email: user[0].email,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
