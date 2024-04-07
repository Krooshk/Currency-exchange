const express = require("express");
const currencyController = require("../../controllers/currencyController");

const router = express.Router();

router.get("/currencies", currencyController.getAllCurrencies);

router.get("/currency/:code?", currencyController.getOneCurrency);

router.post("/currencies", currencyController.addCurrency);

//
router.get("/exchangeRates", currencyController.getAllExchangeRates);

router.get("/exchangeRate/:name?", currencyController.getOneExchangeRate);

router.post("/exchangeRates", currencyController.addExchangeRate);

router.patch("/exchangeRate/:name?", currencyController.updateExchangeRate);

//
router.get("/exchange", currencyController.calculationСurrency);

module.exports = router;
