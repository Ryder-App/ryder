import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { APP_SECRET } from '../config/env';
import { StatusCodes } from 'http-status-codes';

export const auth = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (token === undefined || token === null) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        status: 'There is an Error',
        message: 'Ensure that you are logged in',
      });
    }

    const pin = token.split(' ')[1];

    if (!pin || pin === '') {
      return res.status(StatusCodes.FORBIDDEN).send({
        status: 'Error',
        message: "The pin can't be used",
      });
    }
    const decoded = jwt.verify(pin, `${APP_SECRET}`);
    req.user = decoded;

    return next();
  } catch (err) {
    console.log('ERROR:', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: 'Error',
      message: err,
    });
  }
};
