const { Router } =  require('express');
const route = Router();
const { jwtValidator } = require('../middleware/jwt');
const { getPurchases, createPaymentmercado , getQueensPurchase, getGalleryPuchaseUser , getuserPurchase,  createPaymentpaypal , paypalOrder, getPurchaseById  } = require('../controllers/purchase')
const Purchase = require('../models/purchase')

route
  .get('/', getPurchases)
  .get("/queen/:queen", getQueensPurchase ) 
  .get("/user/:user/:gallerieName" , getGalleryPuchaseUser)
  .get("/user/:user", getuserPurchase)  
  .post("/paypal" , createPaymentpaypal)
  .post('/ipn', createPaymentmercado)
  .post("/paypalIpn", paypalOrder)
  .get("/id/:id", getPurchaseById )

module.exports = route;
