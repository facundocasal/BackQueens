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
  const userPurchase = await Purchase.find({ userName: user })
  res.json(userPurchase)
}

// obterner por id 

const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params
    const respuesta = await Purchase.findById(id)
    res.json(respuesta)
  } catch (error) {
    res.json({error : "compra no encontrada"})
  }
}


// devuelve las compras asosiadas a una queen 

const getQueensPurchase = async (req, res) => {
  try {
    const { queen } = req.params
    const queenPurchase = await Purchase.find({ queen: queen })
    queenPurchase.length === 0? res.json({msj: `no se encontraron compras`}) 
     : res.json(queenPurchase)
  } catch (error) {
    res.json({error : "no se encontro ninguna compra por queen "})
  }

}

// obtener la galeria y imagenes si el usuario compro esa galeria devuelve todas las imagenes sino devuelve 4 
const getGalleryPuchaseUser = async (req, res) => {
  try {
    const { user, galleryName } = req.params
    const userPurchase = await Purchase.findOne({ userName: user, available: true, galleryName: galleryName })
    if ((!userPurchase) || (userPurchase == "undefined")) {
      const galleryPhotos = await Galeries.findOne({ galleryName: galleryName }, "photoBlur  photosShow numberPhotos galleryName idQueen")
      res.json(galleryPhotos)
    } else {
      const galleryPhotos = await Galeries.findOne({ galleryName: galleryName }, "galleryName idQueen photos numberPhotos")
      res.json(galleryPhotos)
    }
  } catch (error) {
    res.json({error : "galeria no encontrada"})
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
        galleryName : gallerie_name,
        queen: queen,
        price: price,
        method : "mercado Pago",
        available: true,
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
    const { userName, galleryName, queen, price_USD } = req.body

    const newPurchase = await new Purchase({
      userName: userName,
      galleryName: galleryName,
      queen: queen,
      price: price_USD,
      available: true,
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
