const mongoose = require("mongoose");

const DB = process.env.MONGODB_URI || process.env.DATABASE;

mongoose.set("strictQuery", false);

if (!DB) {
  console.error("Missing MONGODB_URI or DATABASE in .env");
} else {
  mongoose
    .connect(DB)
    .then(() => {
      console.log("connection successful");
    })
    .catch((err) => {
      console.log("No connection", err.message);
    });
}
