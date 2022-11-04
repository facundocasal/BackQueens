const { Router } =  require('express');
const route = Router();
const { jwtValidator } = require('../middleware/jwt');
const { getPurchases, createPaymentmercado , getQueensPurchase, getGalleryPuchaseUser , getuserPurchase,  createPaymentpaypal , paypalOrder, getPurchaseById  } = require('../controllers/purchase')
const { isAdmin} = require("../middleware/isAdmin");

route
  .get('/', isAdmin, getPurchases)
  .get("/queen/:queen",jwtValidator, getQueensPurchase ) 
  .get("/user/:user/:galleryName" , getGalleryPuchaseUser)
  .get("/user/:user", jwtValidator , getuserPurchase)  
  .post("/paypal" , createPaymentpaypal)
  .post('/ipn', createPaymentmercado)
  .post("/paypalIpn", paypalOrder)
  .get("/id/:id", isAdmin , getPurchaseById )

module.exports = route;
