const currenciesController = require('../controllers/currencies.controller')

exports.routesConfig = (app) => {
  app.get('/api/pricecalculator/:monto/:moneda', currenciesController.priceCalculator)
  app.get('/api/prices/binance', currenciesController.pricesFromBinance)
  app.post('/api/prices/setprices', currenciesController.setPtrBsPrices)
}