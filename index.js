const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8001;

// body parsers must come before the logging middleware if you want to inspect parsed bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logging middleware - placed after body parsers and before routes
app.use((req, res, next) => {
  console.log("> Incoming", req.method, req.url, "Content-Type:", req.headers["content-type"]);
  // log parsed body (will be undefined if parser didn't run or couldn't parse)
  console.log("> Parsed body:", req.body);
  next();
});

app.use("/url", urlRoute);

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});