require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Test");
});

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
