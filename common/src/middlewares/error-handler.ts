import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

// TODO: this error handler will not work for Promises that reject in Async-Await context. this down-sides of express 
//       take a look at this article: https://codefibershq.com/blog/handling-promise-rejections-in-expressjs-nodejs-with-ease
//       
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err);
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
