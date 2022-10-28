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
        email: "user@email.com"
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
      back_urls: {
        failure: `http://localhost:3000/gallery/${id}`,
        pending: `http://localhost:3000/gallery/${id}`,
        success: `http://localhost:3000/`
      },
      auto_return: "approved",
      external_reference: "user@lalala.com",
      notification_url: `https://54b0-181-165-54-187.sa.ngrok.io/purchase/ipn`
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




