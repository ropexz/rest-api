import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["auth-session"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });
    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const currentUserId = get(req, "identity._id") as unknown as string;
    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== req.params.id) {
      return res.sendStatus(403);
    }

    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
