const { Schema, model } = require('mongoose')

const queen = new Schema({
  name: String,
  coverImage: String,
  password : String,
  email : String,
  role : String
})

module.exports = model('Queen', queen)
