const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./my_database.sqlite");

async function startDatabase() {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS Currencies");

    db.run("DROP TABLE IF EXISTS ExchangeRates");

    db.run(
      "CREATE TABLE IF NOT EXISTS Currencies (id INTEGER PRIMARY KEY, Code VARCHAR,  FullName VARCHAR, Sign VARCHAR)"
    );

    db.run(
      "CREATE TABLE IF NOT EXISTS ExchangeRates (id INTEGER PRIMARY KEY, BaseCurrencyId int,  TargetCurrencyId int, Rate Decimal(6))"
    );

    db.run(
      "INSERT INTO Currencies (Code, FullName, Sign) VALUES ('AUD', 'Australian dollar', 'A$')"
    );

    db.run(
      "INSERT INTO Currencies (Code, FullName, Sign) VALUES ('RUB', 'Russian Ruble', '₽')"
    );

    db.run(
      "INSERT INTO Currencies (Code, FullName, Sign) VALUES ('USD', 'US Dollar', '$')"
    );

    db.run(
      "INSERT INTO Currencies (Code, FullName, Sign) VALUES ('EUR', 'Euro', '€')"
    );

    db.run(
      "INSERT INTO ExchangeRates (BaseCurrencyId, TargetCurrencyId, Rate) VALUES ('3', '1', '1.53')"
    );

    db.run(
      "INSERT INTO ExchangeRates (BaseCurrencyId, TargetCurrencyId, Rate) VALUES ('3', '2', '92.61')"
    );

    db.run(
      "INSERT INTO ExchangeRates (BaseCurrencyId, TargetCurrencyId, Rate) VALUES ('3', '4', '0.924113')"
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
