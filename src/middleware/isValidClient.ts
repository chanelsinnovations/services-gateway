import axios from "axios";
import { Response, Request, NextFunction, response } from "express";

const isValidClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers["x-client-type"]) {
      return res.status(400).json({
        message: "Client type not passed.",
      });
    }

    // check if the x-client-type is passed
    let clienttype = req.headers["x-client-type"];
    let { url, body, method, params } = req;

    if (clienttype == "role" || clienttype == "user") {
      const token = req.headers["authorization"]?.split(" ")[1];

      let result = await axios({
        method,
        url: process.env["role_user_url"] + url,
        data: ["POST", "PUT", "PATCH"].includes(method) ? req.body : undefined,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.status(200).json({
        ...result.data,
      });
    }

    // handle other x-client-types

    return res.status(410).json({
      message: "Unknown client type",
    });
  } catch (error: any) {
    // Handle errors
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message,
      });
    }
    return res.status(500).json({
      message: error.message,
      error: "Error setting up the request",
    });
  }
};

export default isValidClient;
