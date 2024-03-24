const { db } = require("../database/data");
const currencyService = require("../services/currencyService");

const getAllCurrencies = (req, res) => {
  currencyService.getAllCurrencies(res);
};

const getOneCurrency = (req, res) => {
  const {
    params: { name },
  } = req;
  currencyService.getOneCurrency(name, res);
};

const addCurrency = (req, res) => {
  res.send("Create a new Currency ");
};

const getAllExchangeRates = (req, res) => {
  db.all("SELECT * from ExchangeRates", (err, row) => {
    res.send(row);
  });
};

const getOneExchangeRate = (req, res) => {
  const {
    params: { name },
  } = req;
  currencyService.getOneExchangeRate(name, res);
};

const addExchangeRate = (req, res) => {
  res.send("Create a new ExchangeRate ");
};

const updateExchangeRate = (req, res) => {
  res.send("update Exchange Rate");
};

const calculationСurrency = (req, res) => {
  const { amount, from, to } = req.query;
  res.send(
    `${amount} ${from} ${to} Расчёт перевода определённого количества средств из одной валюты в другую`
  );
};

module.exports = {
  getAllCurrencies,
  getOneCurrency,
  addCurrency,
  getAllExchangeRates,
  getOneExchangeRate,
  updateExchangeRate,
  calculationСurrency,
  addExchangeRate,
};
