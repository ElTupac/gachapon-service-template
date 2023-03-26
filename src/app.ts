import express, { Express } from "express";
import morgan from "morgan";
import corsImplementation from "./cors";
import { DataSource } from "typeorm";
import * as Entities from "./entities";

import userRoutes from "./routes/UserRoutes";

import { config } from "dotenv";
config();

(async () => {
  const router: Express = express();

  router.use(morgan("dev"));
  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());

  router.options("/*", corsImplementation);

  const ddbbConnection = await new DataSource({
    type: "postgres",
    ssl: true,
    entities: Entities,
    ...(process.env.DATABASE_URL
      ? { url: process.env.DATABASE_URL }
      : {
          host: process.env.DDBB_HOST || "",
          username: process.env.DDBB_USERNAME || "",
          password: process.env.DDBB_PASSWORD || "",
          database: process.env.DDBB_DATABASE || "",
        }),
  });
  await ddbbConnection.initialize();

  router.use("/user", corsImplementation, await userRoutes(ddbbConnection));

  router.get("/status", (req, res) =>
    res.status(200).json({
      message: "server is up and running",
    })
  );
  router.use((req, res) => {
    const error = new Error("no resource");
    return res.status(404).json({
      message: error.message,
    });
  });

  const PORT = process.env.PORT || 8000;
  router.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
