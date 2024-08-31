import app from './app';
import { db, ENV } from './config';
import { HttpError } from 'http-errors';
import winstonLogger from './utilities/helpers/winston';

const port = ENV.PORT || 3000;

async function startServer() {
  try {
    db.sync({
      // force:true
    })
      .then(() => {
        winstonLogger.info('Database is connected');
      })
      .catch((err: HttpError) => {
        winstonLogger.error(err);
      });

    app.listen(port, () => {
      winstonLogger.info(
        `Ryder Server: Api docs, open @  http://localhost:${port}/api-docs`,
      );
      winstonLogger.info(`Local baseUrl, use @ http://localhost:${port}/api/`);
    });
  } catch (err) {
    winstonLogger.error('Error starting the server', err);
  }
}

startServer();
