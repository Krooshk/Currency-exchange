// In src/index.js
const express = require("express");
const path = require("path");
const v1currencyRouter = require("./V1/routes/currencyRoutes");
const bodyParser = require("body-parser");
const { startDatabase } = require("./database/data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../client")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/index.html"));
});

app.use(bodyParser.json());
app.use("/api/v1/", v1currencyRouter);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  startDatabase();
});
