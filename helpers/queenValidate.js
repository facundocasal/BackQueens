const Queen = require('../models/queen')

const validateQueen = async(name) => {
  const isName = await Queen.findOne({name})

  if (isName) {
    throw new Error(`Algo salió mal`)
  }
}

module.exports = { validateQueen }