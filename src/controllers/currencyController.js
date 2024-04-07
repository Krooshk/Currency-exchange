const currencyService = require("../services/currencyService");

const getAllCurrencies = async (_, res) => {
  try {
    const allCurrencies = await currencyService.getAllCurrencies();
    res.send(allCurrencies);
  } catch (error) {
    res.status(500).send("Ошибка: база данных недоступна");
  }
};

const getOneCurrency = async (req, res) => {
  const {
    params: { code },
  } = req;

  if (!code) {
    res.status(400).send("Код валюты отсутствует в адресе");
  }

  try {
    const currency = await currencyService.getOneCurrency(code);

    if (!currency) {
      res.status(404).send("Валюта не найдена");
    }

    res.send(currency);
  } catch (error) {
    res.status(500).send("Ошибка: база данных недоступна");
  }
};

const addCurrency = async (req, res) => {
  const { name, code, sign } = req.body;

  if (!(name && code && sign)) {
    res.status(400).send("Отсутствует нужное поле формы");
  }

  try {
    const currency = await currencyService.addCurrency(name, code, sign);

    if (currency === "Exict") {
      res.status(409).send("Валюта с таким кодом уже существует");
    } else {
      res.status(201).send(currency);
    }
  } catch (error) {
    res.status(500).send("Ошибка: база данных недоступна");
  }
};

const getAllExchangeRates = async (_, res) => {
  try {
    const allExchangeRates = await currencyService.getAllExchangeRates();
    res.send(allExchangeRates);
  } catch (error) {
    res.status(500).send("Ошибка: база данных недоступна");
  }
};

const getOneExchangeRate = async (req, res) => {
  const {
    params: { name },
  } = req;

  if (!name) {
    res.status(400).send("Коды валют пары отсутствуют в адресе");
  }

  try {
    const exchangeRate = await currencyService.getOneExchangeRate(name);

    if (!exchangeRate) {
      res.status(404).send("Обменный курс для пары не найден");
    }

    res.send(exchangeRate);
  } catch (error) {
    res.status(500).send("Ошибка: база данных недоступна");
  }
};

const addExchangeRate = async (req, res) => {
  const { baseCurrencyCode, targetCurrencyCode, rate } = req.body;

  if (!(baseCurrencyCode && targetCurrencyCode && rate)) {
    res.status(400).send("Отсутствует нужное поле формы");
    return;
  }

  try {
    const exchangeRate = await currencyService.addExchangeRate(
      baseCurrencyCode,
      targetCurrencyCode,
      rate
    );

    res.status(201).send(exchangeRate);
  } catch (error) {
    switch (error) {
      case 409:
        res.status(409).send("Валютная пара с таким кодом уже существует");
        break;
      case 404:
        res
          .status(404)
          .send("Одна (или обе) валюта из валютной пары не существует в БД");
        break;
      default:
        res.status(500).send("Ошибка: база данных недоступна");
    }
  }
};

const updateExchangeRate = async (req, res) => {
  const {
    params: { name },
  } = req;

  const exchangeRate = await currencyService.updateExchangeRate(req, name);
  res.send(exchangeRate);
};

const calculationСurrency = async (req, res) => {
  const result = await currencyService.calculationСurrency(req);
  res.send(result);
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
