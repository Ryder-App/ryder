import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import winstonLogger from '../utilities/helpers/winston';

const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
};

const errorHandler = (err: HttpError, req: Request, res: Response) => {
  // Log the error
  winstonLogger.error(err.message, err);

  // Determine the status code
  const statusCode = err.status || 500;
  res.status(statusCode);

  // Determine the response
  if (req.app.get('env') === 'development') {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ message: err.message });
  }
};

export { notFound, errorHandler };
