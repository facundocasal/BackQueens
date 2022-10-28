const { Router } = require('express')
const route = Router()
const { body } = require('express-validator')
const { 
  createGalleries ,
  getGallerieById ,
  getGalleries ,
  getGallerieByQueen,
  getGallerieBygalleryName,
  deleteGallerie,
  updateGallerie
} = require('../controllers/galleries')
const Galleries = require('../models/galleries')

route
  // obtener todas las galerias 
  .get("/", getGalleries )
  // galleries by ID
  .get("/id/:id", getGallerieById)
  // galleries by queen
  .get("/queen/:queen", getGallerieByQueen) 
  // galleries by name 
  .get("/:galleryName/:queen", getGallerieBygalleryName)
  // crear galeria
  .post("/",
  body('idQueen'),
  // body('galleryName').trim().escape().isAlpha('es-ES', {ignore: ''}).not().isEmpty().isLength({min: 3, max: 30}),
  body('galleryName').trim().escape().not().isEmpty().isLength({min: 3, max: 30}),
  body('coverPhotoGallery'),
  body('price').trim().escape().isNumeric().isLength({min: 2, max: 6}),
  body('price_USD').trim().escape().isNumeric().isLength({min: 2, max: 6}),
  body('[photos]'),
  createGalleries)
  
  .post("/updateGallerie", updateGallerie )
  // borrar galeria por id
  .delete("/delete/:id", deleteGallerie)

  
module.exports = route
