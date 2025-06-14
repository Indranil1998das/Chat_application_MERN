// UncaughtException detection
process.on("uncaughtException", (error) => {
  console.log(`error: ${error.message}`);
  console.log(`shutting down the server due to uncaughtException`);
});
const dotenv = require("dotenv");
const databaseConnection = require("./config/database");
const { socketServer } = require("./socketServer");
dotenv.config({ path: "config/.env" });
// Server Start In this Point
socketServer.listen(4500, () => {
  databaseConnection();
  console.log(`SERVER IS RUNNING ON 4500 PORT`);
});

// UnhandledRejection detection
process.on("unhandledRejection", (error) => {
  console.log(`error ${error.message}`);
  console.log(`shutting down the server due to unhandledRejection`);
  socketServer.close(() => {
    process.exit(1);
  });
});
