const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  "D:/ROADMAP_Zhukov/Github/Currency-exchange/src/database/my_database.sqlite"
);

module.exports = function startDatabase() {
  db.run("DROP TABLE IF EXISTS Currencies");

  db.run(
    "CREATE TABLE IF NOT EXISTS Currencies (id INTEGER PRIMARY KEY, Code VARCHAR,  FullName VARCHAR, Sign VARCHAR)"
  );

  db.run(
    "INSERT INTO IF EXISTS Currencies (Code, FullName, Sign) VALUES ('AUD', 'Australian dollar', 'A$')"
  );

  db.run(
    "INSERT INTO IF EXISTS Currencies (Code, FullName, Sign) VALUES ('RUB', 'Russian Ruble', '₽')"
  );

  db.run(
    "INSERT INTO IF EXISTS Currencies (Code, FullName, Sign) VALUES ('USD', 'US Dollar', '$')"
  );

  db.run(
    "INSERT INTO IF EXISTS Currencies (Code, FullName, Sign) VALUES ('EUR', 'Euro', '€')"
  );

  //   db.all("SELECT * from Currencies", (error, row) => {
  //     if (error) {
  //       console.error(error.message);
  //       return;
  //     }
  //     console.log(row);
  //   });
};
