import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/tfg');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));

db.once("open", function () {
  console.log("Connected successfully");
});

export default db;