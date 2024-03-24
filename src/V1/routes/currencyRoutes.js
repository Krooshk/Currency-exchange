const express = require("express");
// const workoutController = require("../../controllers/workoutController");
// const recordController = require("../../controllers/recordController");

const router = express.Router();

router.get("/currencies", (req, res) => {
  res.send(`Получение списка валют`);
});

router.get("/currency/:name", (req, res) => {
  res.send("Получение конкретной валюты");
});

router.post("/currencies", (req, res) => {
  res.send("Добавление новой валюты в базу");
});

//

router.get("/exchangeRates", (req, res) => {
  res.send("Получение списка всех обменных курсов");
});

router.get("/exchangeRate/:name", (req, res) => {
  res.send("Получение конкретного обменного курса");
});

router.post("/exchangeRates", (req, res) => {
  res.send("Добавление нового обменного курса в базу");
});

router.patch("/exchangeRate/:name", (req, res) => {
  res.send("Обновление существующего в базе обменного курса");
});

//

router.get("/exchange", (req, res) => {
  const { amount, from, to } = req.query;
  res.send(
    `${amount} ${from} ${to} Расчёт перевода определённого количества средств из одной валюты в другую`
  );
});

module.exports = router;
