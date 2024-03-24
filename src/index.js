// In src/index.js
const express = require("express");
const v1currencyRouter = require("./V1/routes/currencyRoutes");
const bodyParser = require("body-parser");
const startDB = require("./database/data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api/v1/", v1currencyRouter);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});

startDB();
