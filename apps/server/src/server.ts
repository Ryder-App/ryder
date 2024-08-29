import app from "./app";
import { db, ENV } from "./config";
import { HttpError } from "http-errors";

const port = ENV.PORT || 3000;

async function startServer() {
  try {
    db.sync({
      // force:true
    })
      .then(() => {
        console.log("Database is connected");
      })
      .catch((err: HttpError) => {
        console.log(err);
      });

    app.listen(port, () => {
      console.log(
        `\n\nRyder Server:\n\nApi docs, open @  http://localhost:${port}/api-docs`
      );
      console.log(`\nLocal baseUrl, use @ http://localhost:${port}/api/`);
    });
  } catch (err) {
    console.log("Error starting the server", err);
  }
}

startServer();
