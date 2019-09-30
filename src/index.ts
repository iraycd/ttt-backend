import { createServer } from "./app";

const PORT = process.env.PORT || 1337;

createServer().then(
  app =>
    app.listen(PORT, () => {
      const mode = process.env.NODE_ENV;
      console.debug(`Server listening on ${PORT} in ${mode} mode`);
    }),
  err => {
    console.error("Error while starting up server", err);
    process.exit(1);
  }
);
