const mercadopago = require("mercadopago")
require('dotenv').config()

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
})

class MercadoPago {
 createPay = (req ,res) =>{
    const { galleryName , queen , price , id} = req.body
    let preference = {
      payer: {
        email: req.userEmail
      },
      items: [
        {
          title: galleryName,
          description: queen,
          category_id: "Gallery",
          quantity: 1,
          unit_price: Number(price)
        }
      ],
      metadata: {
        userId : req.userId,
        userName: req.userEmail,
        galleryName : galleryName,
        queen : queen,
        price: price
      },
      back_urls: {
        success: `${process.env.URL}`
      },
      auto_return: "approved",
    };

    mercadopago.preferences.create(preference)
    .then(response => {
      res.json(response.body.init_point)
    })
    .catch( err =>{
      console.log(err)
    })
  }

}


module.exports = MercadoPago



