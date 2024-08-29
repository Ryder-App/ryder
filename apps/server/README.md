**Server Setup**

1. clone project.
2. navigate to the server directory
3. install dependencies by running `npm install`.

   ```bash
   npm install
   ```

4. create `.env.production` and `.env.development` files.

   ```bash
   touch .env.development
   ```

5. copy the env template in .env.sample into the files created in step 4 above.

```bash
cp .env.sample .env.development
```

6. supply the values for your development and production env.
7. run `npm run dev` to start server in development mode.

---

Starting the server in production mode:

1. navigate to server directory ("./apps/server")
2. run `npm run prod`
