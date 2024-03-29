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

const getOneExchangeRate = async (req, res) => {
  const {
    params: { name },
  } = req;

  const exchangeRate = await currencyService.getOneExchangeRate(name);
  res.send(exchangeRate);
};

const addExchangeRate = async (req, res) => {
  const exchangeRate = await currencyService.addExchangeRate(req);
  res.send(exchangeRate);
};

const updateExchangeRate = async (req, res) => {
  const {
    params: { name },
  } = req;

  const exchangeRate = await currencyService.updateExchangeRate(req, name);
  res.send(exchangeRate);
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
