const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./my_database.sqlite");

async function startDatabase() {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS Currencies");

    db.run("DROP TABLE IF EXISTS ExchangeRates");

    db.run(
      "CREATE TABLE IF NOT EXISTS Currencies (id INTEGER PRIMARY KEY, code VARCHAR,  name VARCHAR, sign VARCHAR)"
    );

    db.run(
      "CREATE TABLE IF NOT EXISTS ExchangeRates (id INTEGER PRIMARY KEY, baseCurrency int,  targetCurrency int, rate Decimal(6))"
    );

    db.run(
      "INSERT INTO Currencies (code, name, sign) VALUES ('AUD', 'Australian dollar', 'A$')"
    );

    db.run(
      "INSERT INTO Currencies (code, name, sign) VALUES ('RUB', 'Russian Ruble', '₽')"
    );

    db.run(
      "INSERT INTO Currencies (code, name, sign) VALUES ('USD', 'US Dollar', '$')"
    );

    db.run(
      "INSERT INTO Currencies (code, name, sign) VALUES ('EUR', 'Euro', '€')"
    );

    db.run(
      "INSERT INTO ExchangeRates (baseCurrency, targetCurrency, rate) VALUES ('3', '1', '1.53')"
    );

    db.run(
      "INSERT INTO ExchangeRates (baseCurrency, targetCurrency, rate) VALUES ('3', '2', '92.61')"
    );

    db.run(
      "INSERT INTO ExchangeRates (baseCurrency, targetCurrency, rate) VALUES ('3', '4', '0.924113')"
    );

    // db.all("SELECT * from ExchangeRates", (error, row) => {
    //   if (error) {
    //     console.error(error.message);
    //     return;
    //   }
    //   console.log(row);
    // });

    // db.all("SELECT * from Currencies", (error, row) => {
    //   if (error) {
    //     console.error(error.message);
    //     return;
    //   }
    //   //   console.log(row);
    // });
  });
}

module.exports = { startDatabase, db };
