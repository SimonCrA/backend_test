const axios = require('axios')

const callTheApi = async (url) => {
  const response = await axios.get(url)
  return response
}

exports.currentPrices = async (currencies) => {

  const requests = currencies.map( (reqCurrency) => {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${reqCurrency}USDT`
    return callTheApi(url)
      .then((res) => {
        return res.data
      })
  })
  return Promise.all(requests)
}