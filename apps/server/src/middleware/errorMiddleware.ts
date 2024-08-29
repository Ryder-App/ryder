import { Request, Response, NextFunction } from "express";
import createError, { HttpError } from "http-errors";

const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
}

const errorHandler = (err: HttpError, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
};

export { notFound, errorHandler };
