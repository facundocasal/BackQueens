require('dotenv').config()
const jwt = require("jsonwebtoken")

const token_secret = process.env.TOKEN_SECRET

const jwtValidator = async(req, res, next) => {
  
  const accessToken = req.headers['accesstoken']

  try {
    const decode = jwt.verify(accessToken, token_secret)
    req.userId = decode.userId;
    req.userEmail = decode.email;
    if (decode) {
      return next()
    }
    return res.status(404).json({
      message: "User Not found!"
    })
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized"
    })
  }
}

module.exports = { jwtValidator }
