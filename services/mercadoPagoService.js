const axios = require("axios");

class PaymentService {

  async createPayment(req) {

    const url = "https://api.mercadopago.com/checkout/preferences";
    const { user , galleryName , queen , price} = req.body
    const body = {
      payer_email: user,
      items: [
        {
          title: galleryName,
          description: `galeria de ${queen}`,
          picture_url: "http://www.myapp.com/myimage.jpg", // requerido 
          category_id: "category123",
          quantity: 1,
          unit_price: Number(price)
        }
      ],
      back_urls: {
        failure: "/failure",
        pending: "/pending",
        success: "/success"
      }
    };

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return payment.data;
  }
}

module.exports = PaymentService;