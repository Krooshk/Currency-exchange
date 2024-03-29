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

const getOneExchangeRate = (name) => {
  const [base, target] = [name.slice(0, 3), name.slice(3)];
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * from ExchangeRates  
       WHERE BaseCurrencyId = (SELECT id from Currencies WHERE Code = '${base}')
       AND TargetCurrencyId = (SELECT id from Currencies WHERE Code = '${target}')
       `,
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

const addExchangeRate = (req) => {
  const { baseCurrencyCode, targetCurrencyCode, rate } = req.query;

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO ExchangeRates (BaseCurrencyId, TargetCurrencyId, Rate) VALUES
       ((SELECT id from Currencies where Code = '${baseCurrencyCode}'),
        (SELECT id from Currencies where Code = '${targetCurrencyCode}'),
         '${rate}') `,
      (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};

const updateExchangeRate = (req, name) => {
  const { rate } = req.query;
  const [base, target] = [name.slice(0, 3), name.slice(3)];
  return new Promise((resolve, reject) => {
    db.get(
      `UPDATE ExchangeRates SET (BaseCurrencyId, TargetCurrencyId, Rate) =
       ((SELECT id from Currencies where Code = '${base}'),
       (SELECT id from Currencies where Code = '${target}'),
       '${rate}' )
       WHERE BaseCurrencyId = (SELECT id from Currencies WHERE Code = '${base}')
       AND TargetCurrencyId = (SELECT id from Currencies WHERE Code = '${target}')`,
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
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
