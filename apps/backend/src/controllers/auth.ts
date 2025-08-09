import { Request, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SignupSchema } from "../schema/users";
import { prismaClient } from "..";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions";
import { NotFoundException } from "../exceptions/not-found";
import { JWT_SECRET } from "../secrets";

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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  if (!compareSync(password, user.password)) throw new BadRequestException("Incorrect password", ErrorCode.INCORRECT_PASSWORD);

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  const { createdAt, updatedAt, password: responseUserPassword, ...responseUser } = user;

  res.json({ user: responseUser, token });
};
