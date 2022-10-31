const mercadopago = require("mercadopago")
require('dotenv').config()

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
})

class MercadoPago {
 createPay = (req ,res) =>{
    const { user , galleryName , queen , price , id } = req.body

    let preference = {
      payer: {
        email: user
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
        userName: user,
        gallerieName : galleryName,
        queen : queen,
        price: price
      },
      back_urls: {
        // failure: `http://localhost:3000/gallery/${id}`,
        // pending: `http://localhost:3000/gallery/${id}`,
        success: `https://www.google.com`
      },
      auto_return: "approved",
      // notification_url: ``
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




