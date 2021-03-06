const pool = require('../services/postgres.service')
const { currentPrices } = require('../services/binance.service')

exports.priceCalculator = async (req, res) => {

  const amount = parseFloat(req.params.monto)
  const currency= (req.params.moneda).toUpperCase()
  console.log(currency)
  if (amount !== undefined && currency !== undefined) {

    const currencies = ['BTC', 'ETH', 'DASH', 'EUR']
    const currentPricesArr =  await currentPrices(currencies)
    if (currentPricesArr.length !== 0) {

      const staticPrices = [
        { symbol: 'PTRUSD', price: '60' },
        { symbol: 'BSUSD', price: '0.00001' }
      ]
      staticPrices.forEach(element => {
        currentPricesArr.push(element)
      })
      let outputObject = {}
      switch (currency) {
        case 'BTC':
          outputObject = {
            btc: amount,
            eth: amount*(parseFloat(currentPricesArr[0].price)/parseFloat(currentPricesArr[1].price)),
            dash: amount*(parseFloat(currentPricesArr[0].price)/parseFloat(currentPricesArr[2].price)),
            eur: amount*(parseFloat(currentPricesArr[0].price)/parseFloat(currentPricesArr[3].price)),
            ptr: amount*(parseFloat(currentPricesArr[0].price)/parseFloat(currentPricesArr[4].price)),
            bs: amount*(parseFloat(currentPricesArr[0].price)/parseFloat(currentPricesArr[5].price))
          }
          break
        case 'ETH':
          outputObject = {
            btc: amount*(parseFloat(currentPricesArr[1].price)/parseFloat(currentPricesArr[0].price)),
            eth: amount,
            dash: amount*(parseFloat(currentPricesArr[1].price)/parseFloat(currentPricesArr[2].price)),
            eur: amount*(parseFloat(currentPricesArr[1].price)/parseFloat(currentPricesArr[3].price)),
            ptr: amount*(parseFloat(currentPricesArr[1].price)/parseFloat(currentPricesArr[4].price)),
            bs: amount*(parseFloat(currentPricesArr[1].price)/parseFloat(currentPricesArr[5].price))
          }
          break
        case 'DASH':
          outputObject = {
            btc: amount*(parseFloat(currentPricesArr[2].price)/parseFloat(currentPricesArr[0].price)),
            eth: amount*(parseFloat(currentPricesArr[2].price)/parseFloat(currentPricesArr[1].price)),
            dash: amount,
            eur: amount*(parseFloat(currentPricesArr[2].price)/parseFloat(currentPricesArr[3].price)),
            ptr: amount*(parseFloat(currentPricesArr[2].price)/parseFloat(currentPricesArr[4].price)),
            bs: amount*(parseFloat(currentPricesArr[2].price)/parseFloat(currentPricesArr[5].price))
          }
          break
        case 'EUR':
          outputObject = {
            btc: amount*(parseFloat(currentPricesArr[3].price)/parseFloat(currentPricesArr[0].price)),
            eth: amount*(parseFloat(currentPricesArr[3].price)/parseFloat(currentPricesArr[1].price)),
            dash: amount*(parseFloat(currentPricesArr[3].price)/parseFloat(currentPricesArr[2].price)),
            eur: amount,
            ptr: amount*(parseFloat(currentPricesArr[3].price)/parseFloat(currentPricesArr[4].price)),
            bs: amount*(parseFloat(currentPricesArr[3].price)/parseFloat(currentPricesArr[5].price))
          }
          break
        case 'PTR':
          outputObject = {
            btc: amount*(parseFloat(currentPricesArr[4].price)/parseFloat(currentPricesArr[0].price)),
            eth: amount*(parseFloat(currentPricesArr[4].price)/parseFloat(currentPricesArr[1].price)),
            dash: amount*(parseFloat(currentPricesArr[4].price)/parseFloat(currentPricesArr[2].price)),
            eur: amount*(parseFloat(currentPricesArr[4].price)/parseFloat(currentPricesArr[3].price)),
            ptr: amount,
            bs: amount*(parseFloat(currentPricesArr[4].price)/parseFloat(currentPricesArr[5].price))
          }
          break
        case 'BS':
          outputObject = {
            btc: amount*(parseFloat(currentPricesArr[5].price)/parseFloat(currentPricesArr[0].price)),
            eth: amount*(parseFloat(currentPricesArr[5].price)/parseFloat(currentPricesArr[1].price)),
            dash: amount*(parseFloat(currentPricesArr[5].price)/parseFloat(currentPricesArr[2].price)),
            eur: amount*(parseFloat(currentPricesArr[5].price)/parseFloat(currentPricesArr[3].price)),
            ptr: amount*(parseFloat(currentPricesArr[5].price)/parseFloat(currentPricesArr[4].price)),
            bs: amount
          }
          break
      }
      res.status(200).json({
        ok: true,
        data: outputObject
      })
      
    } else {
      res.status(404).json({
        ok: false,
        err: 'No es posible conectarse con la API de Binance'
      })
    }
    
  } else {
    res.status(404).json({
      ok: false,
      err: 'el monto y la moneda son necesarios'
    })
  } 
}

exports.pricesFromBinance = async (req, res) => {
  let staticPrices = new Array()
  const currencies = ['BTC', 'ETH', 'DASH', 'EUR']
  const currentPricesFromBinance =  await currentPrices(currencies)

  const DBPrices = await pool.query('SELECT * FROM coins ORDER BY ID ASC', (error, results) => {
    if (error) {
      throw error
    }
    return results.rows
  })
  staticPrices = DBPrices
  console.log(staticPrices)
  if (currentPricesFromBinance.length !== 0 ) {
    const staticPrices = [
      { symbol: 'PTRUSD', price: '60' },
      { symbol: 'BSUSD', price: '100000' }
    ]
    console.log(staticPrices)
    staticPrices.forEach(element => {
      currentPricesFromBinance.push(element)
    })
    res.status(200).json({
      ok: true,
      data: currentPricesFromBinance
    })
  } else {
    res.status(404).json({
      ok: false,
      err: 'No es posible conectarse con la API de Binance'
    })
  }



}

exports.setPtrBsPrices = async (req, res) => {
  const symbol = req.body.symbol.toUpperCase()
  const price = parseFloat(req.body.price)

  pool.query('INSERT INTO coins (symbol, price) VALUES ($1, $2) RETURNING id, symbol, price',
    [symbol, price],
    (error, result) => {
    if (error) {
      throw error
    }
    res.status(200).json(`Coin ${ result.rows[0].symbol} added with ID: ${result.rows[0].id} and price ${result.rows[0].price}`)
  })
}