const { db } = require("../database/data");

const getAllCurrencies = (res) => {
  db.all("SELECT * from Currencies", (err, row) => {
    res.send(row);
  });
};

const getOneCurrency = (name, res) => {
  db.get(`SELECT * from Currencies WHERE Code = '${name}'`, (err, row) => {
    res.send(row);
  });
};

const addCurrency = () => {
  return;
};

const getAllExchangeRates = () => {
  db.all("SELECT * from ExchangeRates", (err, row) => {
    res.send(row);
  });
};

const getOneExchangeRate = (name, res) => {
  const [base, target] = [name.slice(0, 3), name.slice(3)];
  console.log(base);
  db.get(
    `SELECT * from ExchangeRates  
    WHERE BaseCurrencyId = (SELECT id from Currencies WHERE Code = '${base}')
    AND TargetCurrencyId = (SELECT id from Currencies WHERE Code = '${target}')
    `,
    (err, row) => {
      console.log(row);
      res.send(row);
    }
  );
  //   WHERE BaseCurrencyId = 'BASE'

  //   db.get(`SELECT id from Currencies WHERE Code = '${base}'`, (err, row) => {
  //     console.log(base, row);
  //     res.send(row);
  //   });
};

const addExchangeRate = () => {
  return;
};

const updateExchangeRate = () => {
  return;
};

const calculationСurrency = () => {
  return;
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
