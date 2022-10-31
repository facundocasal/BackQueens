const Purchase = require('../models/purchase')
const Galeries = require("../models/galleries");
const mercadopago = require('mercadopago');
const paypal = require('@paypal/checkout-server-sdk');

// obtener todas las compras 

const getPurchases = async (req, res) => {
  // res.json({userId :req.userId, userEmail: req.userEmail})
  // 
  try {
    const purchase = await Purchase.find()
    res.json(purchase)
  } catch (error) {
  }
};

const getuserPurchase = async (req, res) => {
  const { user } = req.params
  console.log(user)
  const userPurchase = await Purchase.find({ userName: user })
  res.json(userPurchase)
}

// obterner por id 

const getPurchaseById = async (req, res) => {
  const { id } = req.params
  const respuesta = await Purchase.findById(id)
  res.json(respuesta)
}


// devuelve las compras asosiadas a una queen 

const getQueensPurchase = async (req, res) => {
  const { queen } = req.params
  const queenPurchase = await Purchase.find({ queen: queen })
  res.json(queenPurchase)
}

// obtener la galeria y imagenes si el usuario compro esa galeria devuelve todas las imagenes sino devuelve 4 
const getGalleryPuchaseUser = async (req, res) => {
  const { user, gallerieName } = req.params
  const userPurchase = await Purchase.find({ userName: user, Available: true, gallerieName: gallerieName })
  if ((userPurchase.length === 0) || (userPurchase == "undefined")) {
    const galleryPhotos = await Galeries.find({ galleryName: gallerieName }, "photoBlur  photosShow")
    res.json(galleryPhotos)
  } else {
    const galleryPhotos = await Galeries.find({ galleryName: gallerieName }, "photos")
    res.json(galleryPhotos)
  }
}

// crear compra mercadoPago 

const createPaymentmercado = async (req, res) => {

  try {
    const {id} = req.body.data
    let compra = await mercadopago.payment.findById(id)
    const {status , status_detail} = compra.body
    if(status === "approved" && status_detail === "accredited"){
      const {user_name , queen , price , gallerie_name } = compra.body.metadata 
      const { fee_details} = compra.body
      const newPurchase = await new Purchase({
        userName: user_name,
        gallerieName : gallerie_name,
        queen: queen,
        price: price,
        method : "mercado Pago",
        Available: true,
        commission : fee_details[0].amount
      })
      await newPurchase.save()
      res.status(200).send("ok")
    }

  } catch (error) {
    console.log(error)
  }
};

// crear compra mercadopaypal

const createPaymentpaypal = async (req, res) => {
  try {
    const { userName, gallerieName, queen, price_USD } = req.body

    const newPurchase = await new Purchase({
      userName: userName,
      gallerieName: gallerieName,
      queen: queen,
      price: price_USD,
      Available: true,
      method : "PayPal",
    })
    await newPurchase.save()
    res.status(201).json(newPurchase)
  }
  catch (err) {
    console.log(err)
  }
}


const paypalOrder = async (req, res) => {
  const soli = new paypal.orders.OrdersCreateRequest();

  const { amounts } = req.body;

  soli.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: `${amounts}`,
        }
      }
    ]
  })
  const respo = await client.execute(soli);
  console.log(`Order: ${JSON.stringify(respo.result)}`);
  return res.json({ id: respo.result.id })
};

module.exports = {
  getPurchases,
  createPaymentmercado,
  getQueensPurchase,
  getGalleryPuchaseUser,
  createPaymentpaypal,
  paypalOrder,
  getuserPurchase,
  getPurchaseById
};
