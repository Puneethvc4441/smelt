const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const tokens = require("./src/token");


const app = express();
app.use(express.json());

app.use("/token", tokens);
app.use("/body",(req, res) => {
  res.status(200).send(`${req.body} `);
});

app.use("*", (req, res) => {
    res.status(404).send(`${req.originalUrl} not found on this server`);
  });
  
  const port = process.env.PORT || 5001;
  app.listen(port, () =>
    console.log(`Server is running and listening on ${port}`)
  );