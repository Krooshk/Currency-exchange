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
      reject(409);
    }

    db.run(
      `INSERT INTO Currencies (code, name, sign) VALUES ('${code}', '${name}', '${sign}')`,
      function (err) {
        if (err) {
          reject(500);
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
    db.all(
      `SELECT er.id, c1.id as baseID, c1.code as baseCode, c1.name as baseName, c1.sign as baseSign, 
       c2.id as targetID, c2.code as targetCode, c2.name as targetName, c2.sign as targetSign, er.rate 
       FROM ExchangeRates er 
       LEFT JOIN Currencies c1 ON er.baseCurrency = c1.id 
       LEFT JOIN Currencies c2 ON er.targetCurrency = c2.id`,
      (err, row) => {
        if (err) {
          reject(err);
        }
        if (!row) {
          resolve(null);
        }

        const formattedArray = row.map((el) => {
          return transformObj.call(this, el);
        });

        resolve(formattedArray);
      }
    );
  });
};

const getOneExchangeRate = (name) => {
  const [base, target] = [name.slice(0, 3), name.slice(3)];
  return new Promise((resolve, reject) => {
    // `SELECT * from ExchangeRates
    // WHERE baseCurrency = (SELECT id from Currencies WHERE code = '${base}')
    // AND targetCurrency = (SELECT id from Currencies WHERE code = '${target}')
    // `;
    db.get(
      `SELECT er.id, c1.id as baseID, c1.code as baseCode, c1.name as baseName, c1.sign as baseSign, 
       c2.id as targetID, c2.code as targetCode, c2.name as targetName, c2.sign as targetSign, er.rate 
       FROM ExchangeRates er 
       LEFT JOIN Currencies c1 ON er.baseCurrency = c1.id 
       LEFT JOIN Currencies c2 ON er.targetCurrency = c2.id
       WHERE c1.code = '${base}'
       AND c2.code = '${target}'
	   `,
      (err, row) => {
        if (err) {
          reject(500);
        }
        if (!row) {
          reject(404);
        } else {
          const newObj = transformObj.call(this, row);
          resolve(newObj);
        }
      }
    );
  });
};

const addExchangeRate = (baseCurrencyCode, targetCurrencyCode, rate) => {
  return new Promise(async (resolve, reject) => {
    getOneExchangeRate(baseCurrencyCode + targetCurrencyCode).then(
      () => reject(409),
      () => {}
    );

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
  const { rate } = req.body;
  const [base, target] = [name.slice(0, 3), name.slice(3)];
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE ExchangeRates SET (baseCurrency, targetCurrency, rate) =
       ((SELECT id from Currencies where code = '${base}'),
       (SELECT id from Currencies where code = '${target}'),
       '${rate}' )
       WHERE baseCurrency = (SELECT id from Currencies WHERE code = '${base}')
       AND targetCurrency = (SELECT id from Currencies WHERE code = '${target}')`,
      function (err, row) {
        if (err) {
          reject(err);
        }
        resolve(rate);
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
      baseCurrency["code"] + targetCurrency["code"]
    );

    if (straightExchangeRate) {
      result = {
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
        amount: amount,
        rate: straightExchangeRate["rate"],
        convertedAmount: Number(amount) * Number(straightExchangeRate["rate"]),
      };
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const reverseExchangeRate = await getOneExchangeRate(
      targetCurrency["code"] + baseCurrency["code"]
    );

    if (reverseExchangeRate) {
      result = {
        baseCurrency: baseCurrency,
        targetCurrency: targetCurrency,
        amount: amount,
        rate: 1 / Number(reverseExchangeRate["rate"]),
        convertedAmount:
          Number(amount) * (1 / Number(reverseExchangeRate["rate"])),
      };
    }
  } catch (error) {}

  try {
    const USDEtoBase = await getOneExchangeRate("USD" + baseCurrency["code"]);
    const USDEtoTarget = await getOneExchangeRate(
      "USD" + targetCurrency["code"]
    );

    const rate = Number(USDEtoTarget["rate"]) / Number(USDEtoBase["rate"]);

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

function transformObj(obj) {
  const fomattedObj = {
    id: obj.id,
    baseCurrency: {
      id: obj.baseID,
      name: obj.baseName,
      code: obj.baseCode,
      sign: obj.baseSign,
    },
    targetCurrency: {
      id: obj.targetID,
      name: obj.targetName,
      code: obj.targetCode,
      sign: obj.targetSign,
    },
    rate: obj.rate,
  };

  return fomattedObj;
}

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
