const mongoose = require("mongoose");
//Database Connection
const databaseConnection = async () => {
  await mongoose.connect(process.env.DATABASE).then(() => {
    console.log(`Database is Connected to URL ${process.env.DATABASE}`);
  });
};

module.exports = databaseConnection;
