import { validate } from "class-validator";
import { RequestHandler } from "express";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { getErrors, throwErrors } from "../utils/errors";

const postNewUser: (userRepository: Repository<User>) => RequestHandler =
  (userRepository) => async (req, res) => {
    try {
      const user = new User();
      Object.assign(user, req.body);
      const errors = await validate(user);
      if (!errors.length) {
        const { mail, name, phone } = user;
        const userExists = await userRepository.findOneBy({ name });
        if (!userExists) {
          const { raw } = await userRepository
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
              mail,
              name,
              phone,
              created_at: () => "NOW()",
            })
            .returning(["id"])
            .execute();
          return res
            .status(201)
            .json({ message: "user created", id: raw[0].id });
        } else throw new Error("mail is already in use");
      } else
        throw throwErrors(
          errors.reduce(
            (accum: string[], { constraints }) => [
              ...accum,
              ...Object.values(constraints || {}),
            ],
            []
          )
        );
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ message: "invalid field(s)", errors: getErrors(error) });
    }
  };

export default postNewUser;
