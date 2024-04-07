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

const getOneCurrency = (code) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * from Currencies WHERE code = '${code}'`, (err, row) => {
      if (err) {
        reject(err);
      }
      if (!row) {
        resolve(null);
      }
      resolve(row);
    });
  });
};

const addCurrency = (name, code, sign) => {
  return new Promise(async (resolve, reject) => {
    const isExict = await getOneCurrency(code);

    if (isExict) {
      resolve("Exict");
    }

    db.run(
      `INSERT INTO Currencies (code, name, sign) VALUES ('${code}', '${name}', '${sign}')`,
      function (err, row) {
        if (err) {
          reject(err);
        }

        resolve({
          id: this.lastID,
          name,
          code,
          sign,
        });
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
      if (!row) {
        resolve(null);
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
       WHERE baseCurrency = (SELECT id from Currencies WHERE code = '${base}')
       AND targetCurrency = (SELECT id from Currencies WHERE code = '${target}')
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

const addExchangeRate = (baseCurrencyCode, targetCurrencyCode, rate) => {
  return new Promise(async (resolve, reject) => {
    const isExict = await getOneExchangeRate(
      baseCurrencyCode + targetCurrencyCode
    );

    if (isExict) {
      reject(409);
      return;
    }

    const base = await getOneCurrency(baseCurrencyCode);
    const target = await getOneCurrency(targetCurrencyCode);

    if (!(base && target)) {
      reject(404);
      return;
    }

    db.run(
      `INSERT INTO ExchangeRates (baseCurrency, targetCurrency, Rate) VALUES (${base.id}, ${target.id}, '${rate}') `,
      function (err) {
        if (err) {
          reject(500);
        }
        resolve({
          id: this.lastID,
          baseCurrency: base,
          targetCurrency: target,
          rate,
        });
      }
    );
  });
};

const updateExchangeRate = (req, name) => {
  const { rate } = req.query;
  const [base, target] = [name.slice(0, 3), name.slice(3)];
  return new Promise((resolve, reject) => {
    db.get(
      `UPDATE ExchangeRates SET (baseCurrency, targetCurrency, rate) =
       ((SELECT id from Currencies where code = '${base}'),
       (SELECT id from Currencies where code = '${target}'),
       '${rate}' )
       WHERE baseCurrency = (SELECT id from Currencies WHERE code = '${base}')
       AND targetCurrency = (SELECT id from Currencies WHERE code = '${target}')`,
      (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      }
    );
  });
};

const calculationСurrency = async (req) => {
  const { amount, from, to } = req.query;
  let baseCurrency;
  let targetCurrency;

  try {
    baseCurrency = await getOneCurrency(from);
    targetCurrency = await getOneCurrency(to);
  } catch (error) {}

  let result = null;

  try {
    const straightExchangeRate = await getOneExchangeRate(
      baseCurrency["Code"] + targetCurrency["Code"]
    );

    if (straightExchangeRate) {
      result = {
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
        amount: amount,
        rate: straightExchangeRate["Rate"],
        convertedAmount: Number(amount) * Number(straightExchangeRate["Rate"]),
      };
    }
  } catch (error) {}

  try {
    const reverseExchangeRate = await getOneExchangeRate(
      targetCurrency["Code"] + baseCurrency["Code"]
    );

    if (reverseExchangeRate) {
      result = {
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
        amount: amount,
        rate: 1 / Number(reverseExchangeRate["Rate"]),
        convertedAmount:
          Number(amount) * (1 / Number(reverseExchangeRate["Rate"])),
      };
    }
  } catch (error) {}

  try {
    const USDEtoBase = await getOneExchangeRate("USD" + baseCurrency["Code"]);
    const USDEtoTarget = await getOneExchangeRate(
      "USD" + targetCurrency["Code"]
    );

    const rate = Number(USDEtoTarget["Rate"]) / Number(USDEtoBase["Rate"]);

    if (USDEtoBase && USDEtoTarget) {
      result = {
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
        amount: amount,
        rate,
        convertedAmount: Number(amount) * rate,
      };
    }
  } catch (error) {}

  return (
    result || {
      message: "Валюта не найдена",
    }
  );
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
