const { Router } =  require('express');
const route = Router();
const { jwtValidator } = require('../middleware/jwt');
const { getPurchases, createPaymentmercado , getQueensPurchase, getGaleryPuchaseUser , getuserPurchase,  createPaymentpaypal , paypalOrder  } = require('../controllers/purchase')
const Purchase = require('../models/purchase')

route
  .get('/', getPurchases)
  .get("/queen/:queen", getQueensPurchase ) 
  .get("/user/:user/:gallerieName?" , getGaleryPuchaseUser)
  .get("/user/:user", getuserPurchase)  
  .post("/paypal" , createPaymentpaypal)
  .post('/ipn', createPaymentmercado)
  .post("/paypalIpn", paypalOrder)
  .get("/id/:id", async (req, res)=>{
    const {id} = req.params
    const respuesta = await Purchase.findById(id)
    res.json(respuesta)
  })

module.exports = route;
