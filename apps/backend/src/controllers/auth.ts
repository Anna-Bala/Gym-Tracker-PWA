import { Request, Response } from "express";
import { hashSync } from "bcrypt";
import { SignupSchema } from "../schema/users";
import { prismaClient } from "..";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions";

export const signup = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = SignupSchema.parse(req.body);

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestException("User already exists", ErrorCode.USER_ALREADY_EXISTS);
  }

  user = await prismaClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashSync(password, 10),
    },
  });

  const { password: responseUserPassword, ...responseUser } = user;
  res.json(responseUser);
};
