import express from "express";

import {
  getUserByEmail,
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
} from "../db/users";
import { random, authentication } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(404);
    }

    const expectedHash = authentication(user.authentication!.salt!, password);

    if (user.authentication!.password !== expectedHash) {
      return res.sendStatus(401);
    }

    const salt = random();
    user.authentication!.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("auth-session", user.authentication!.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      username,
      email,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    });

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const deletedUser = await deleteUserById(req.params.id);

    return res.status(200).json(deletedUser);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!req.body.username) {
      return res.sendStatus(400);
    }

    const user = await getUserById(req.params.id);

    if (!user) {
      return res.sendStatus(404);
    }

    user.username = req.body.username;

    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
