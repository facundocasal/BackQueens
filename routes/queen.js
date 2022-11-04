const { Router } = require('express')
const route = Router()
const { body } = require('express-validator')
const { createQueen, getQueen, deleteQueen, editQueen } = require('../controllers/queen')
const { validateQueen } = require('../helpers/queenValidate');
const { isAdmin} = require("../middleware/isAdmin")

route
  .get('/:idQueen?',
    getQueen
  )

route
  .post('/',
    body('name').trim().escape().isAlpha('es-ES', {ignore: ' '}).not().isEmpty().isLength({min: 3, max: 25}),
    body('name').custom(validateQueen),
    body('coverImage'),
    isAdmin,
    createQueen
  )

route
  .put('/:queenId',
    isAdmin,
    editQueen
  )

route
  .delete('/',
    isAdmin,
    deleteQueen
  )

module.exports = route
