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


// devuelve las compras asosiadas a una queen 

const getQueensPurchase = async (req, res) => {
  const { queen } = req.params
  const queenPurchase = await Purchase.find({ queen: queen })
  res.json(queenPurchase)
}
// obtener la galeria y imagenes si el usuario compro esa galeria devuelve todas las imagenes sino devuelve 4 
const getGaleryPuchaseUser = async (req, res) => {
  const { user, gallerieName } = req.params
  const userPurchase = await Purchase.find({ userName: user })
  res.json(userPurchase)
  if (!userPurchase || userPurchase === "undefined") {
    const galleryPhotos = await Galeries.find({ gallerieName: gallerieName }, "photos",)
    const galleryNoPurchase = galleryPhotos.slice(0, 4)
    res.json(galleryNoPurchase)
  }
  const galleryPhotos = await Galeries.find({ gallerieName: gallerieName }, "photos")
  res.json(galleryPhotos.photos)
}


// crear compra mercadoPago 

const createPaymentmercado = async (req, res) => {

  try {
    // aca estaba probando que iba a recibir por las notificaciones de MP 
    const { topic, id } = req.query;
    const { usario, queen, galeryName, price } = req.params
    console.log(`queryy ${req.query.topic} y ${id}`)

    if (topic === "merchant_order") {
      let merchantOrder = await mercadopago.merchant_orders.findById(id)
      console.log(`matchh orderrrrr ${JSON.stringify(merchantOrder.body.status)}`)
      if (JSON.stringify(merchantOrder.body.status) == "closed") {
        const newPurchase = {
          userName: usario,
          galleryName: JSON.stringify(merchantOrder.body.items.title),
          queen: JSON.stringify(merchantOrder.body.items.description),
          price: JSON.stringify(merchantOrder.body.items.unit_price),
        }
        await Purchase.create(newPurchase)
        res.status(200)
      }

    }

    // switch (topic) {
    //   // case "payment":
    //   //   const paymentId = query.id 
    //   //   const payment = await mercadopago.payment.findById(paymentId)
    //   //   console.log(payment)
    //   //   merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id)
    //   //   console.log(`matchh orderrrrr ${merchantOrder}`)
    //   //   break;
    //   case "merchant_order":
    //     const orderId = query.id;
    //     merchantOrder = await mercadopago.merchant_orders.findById(orderId)
    //     console.log(`matchh orderrrrr ${merchantOrder}`)
    //     break
    // }
    // console.log(`ordeennnn ${merchantOrder}`)
    // if (merchantOrder.body.status == "closed"){
    //   const newPurchase = new Purchase({
    //     userName : usario,
    //     galleryName : galeryName,
    //     queen : queen,
    //     price : price,
    //     comision : merchantOrder.body.status
    // })
    // await Purchase.create(newPurchase)

    // res.status(200)
    // } 

  } catch (error) {
    console.log("no llego nada ")
  }
};

// crear compra mercadopaypal

const createPaymentpaypal = async (req, res) => {
  try {
    const { userName, gallerieName, queen, price } = req.body
    const newPurchase = {
      userName: userName,
      gallerieName: gallerieName,
      queen: queen,
      price: price,
    }
    await Purchase.create(newPurchase)
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
  getGaleryPuchaseUser,
  createPaymentpaypal,
  paypalOrder,
  getuserPurchase
};
