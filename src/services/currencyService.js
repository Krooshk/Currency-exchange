const { db } = require("../database/data");

const getAllCurrencies = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * from Currencies", (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

const getOneCurrency = (name) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * from Currencies WHERE Code = '${name}'`, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

const addCurrency = (req) => {
  const { name, code, sign } = req.query;

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Currencies (Code, FullName, Sign) VALUES ('${code}', '${name}', '${sign}')`,
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(name);
      }
    );
  });
};

const getAllExchangeRates = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * from ExchangeRates", (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
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
  addExchangeRate,
  updateExchangeRate,
  calculationСurrency,
};
