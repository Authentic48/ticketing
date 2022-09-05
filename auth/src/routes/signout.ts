import express, { Request, Response } from 'express';

const route = express.Router();

route.post('/api/users/logout', async (req: Request, res: Response) => {
  // TODO: in real world scenario, you'd use `session.destroy()` or delete any JWT stored in redis cache or database.
  req.session = null;

  res.json({}); // TODO: IMO, I'd use 204 status code for the signout. `res.status(204).end()`
});

export { route as signOut };
