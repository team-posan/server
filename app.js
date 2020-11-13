require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require('cors')
const router = require('./routes')


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Test");
});

app.use(router)

// app.listen(port, () => {
//   console.log(`running on port ${port}`);
// });


module.exports = app