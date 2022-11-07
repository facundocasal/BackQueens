const { Router } =  require('express');
const route = Router();
const { jwtValidator } = require('../middleware/jwt');
const { getPurchases, getUserOrQueenPurchase, createPaymentmercado , getQueensPurchase, getGalleryPuchaseUser , getuserPurchase,  createPaymentpaypal , paypalOrder, getPurchaseById  } = require('../controllers/purchase')
const { isAdmin} = require("../middleware/isAdmin");

const Purchase = require('../models/purchase')

route
  .get('/', isAdmin, getPurchases)

  // .get("/queen/:queen",jwtValidator, getQueensPurchase ) 
  .get("/user/:user/:galleryName" , getGalleryPuchaseUser)
  // .get("/user/:user", jwtValidator , getuserPurchase)  
  .get("/:user" , getUserOrQueenPurchase )
  .post("/paypal", jwtValidator,  createPaymentpaypal)
  .post('/ipn', createPaymentmercado)
  .post("/paypalIpn", jwtValidator,  paypalOrder)
  .get("/id/:id", isAdmin , getPurchaseById)
module.exports = route;
