const { db } = require("../database/data");
const currencyService = require("../services/currencyService");

const getAllCurrencies = async (req, res) => {
  const allCurrencies = await currencyService.getAllCurrencies();
  res.send(allCurrencies);
};

const getOneCurrency = async (req, res) => {
  const {
    params: { name },
  } = req;

  const currency = await currencyService.getOneCurrency(name);
  res.send(currency);
};

const addCurrency = async (req, res) => {
  const currencyName = await currencyService.addCurrency(req);
  const currency = await currencyService.getOneCurrency(currencyName);
  res.send(currency);
};

const getAllExchangeRates = async (req, res) => {
  const allExchangeRates = await currencyService.getAllExchangeRates();
  res.send(allExchangeRates);
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
