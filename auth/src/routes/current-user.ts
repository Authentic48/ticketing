import express, { Request, Response } from 'express';
import { currentLogInUser } from '@authentic48/common';

const route = express.Router();

route.get(
  '/api/users/currentuser',
  currentLogInUser,
  (req: Request, res: Response) => {
    // TODO: Usually here you want to return more details about user
    res.json({ currentUser: req.currentUser || null });
  }
);

export { route as currentUser };
