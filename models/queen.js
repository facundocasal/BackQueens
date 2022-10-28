const { Schema, model } = require('mongoose')

const queen = new Schema({
  name: String,
  coverImage: String  
})

module.exports = model('Queen', queen)
