const Galleries = require('../models/galleries')

const validateGalleries = async(galleryName) => {
  const isGallerie = await Galleries.findOne({galleryName})

  if (isGallerie) {
    throw new Error(`Nombre de galeria existente`)
  }
}

module.exports = { validateGalleries }