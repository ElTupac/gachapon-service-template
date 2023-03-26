import express from "express";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import getUserById from "../services/getUserById";
import postNewUser from "../services/postNewUser";

const routes = async (connection: DataSource) => {
  const _ = express.Router();

  const userRepository = await connection.getRepository(User);

  _.post("/", postNewUser(userRepository));
  _.get("/:userId", getUserById(userRepository));

  return _;
};

export default routes;
