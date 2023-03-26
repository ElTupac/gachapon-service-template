import cors from "cors";
import { NextFunction, Request, Response } from "express";

const corsImplementation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  cors({
    origin(requestOrigin, callback) {
      const allowed_origins = (process.env.CORS_ORIGIN || "").split(",");
      if (
        !allowed_origins.length ||
        allowed_origins[0] === "*" ||
        (requestOrigin && allowed_origins.indexOf(requestOrigin) !== -1)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
    methods: "GET,POST,PUT,PATCH,DELETE",
  })(req, res, (err) => {
    if (err) return res.status(403).json({ message: "forbidden" });
    else next(err);
  });
};

export default corsImplementation;
