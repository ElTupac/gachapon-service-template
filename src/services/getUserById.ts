import { UUID } from "crypto";
import { RequestHandler } from "express";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { getErrors } from "../utils/errors";

const getUserById: (
  userRepository: Repository<User>
) => RequestHandler<{ userId: UUID }> =
  (userRepository) => async (req, res) => {
    const { userId } = req.params;
    console.log("The id:", userId);

    try {
      const user = await userRepository.findOneBy({ id: userId });
      if (user) return res.send(user);
      else throw new Error("not found");
    } catch (error) {
      console.error(error);
      return res.status(404).json({
        errors: getErrors(error),
      });
    }
  };

export default getUserById;
