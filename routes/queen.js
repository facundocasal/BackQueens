const { Router } = require('express')
const route = Router()
const { body } = require('express-validator')
const { createQueen, getQueen, deleteQueen, editQueen } = require('../controllers/queen')
const { validateQueen } = require('../helpers/queenValidate');
const { isAdmin} = require("../middleware/isAdmin");
const { validateEmail, validateUserName  } = require('../helpers/validation');

route
  .get('/:idQueen?',
    getQueen
  )

route
  .post('/',
    body('name').trim().escape().isAlpha('es-ES', {ignore: ' '}).not().isEmpty().isLength({min: 3, max: 25}),
    body('name').custom(validateQueen),
    body('lastName').trim().escape().isAlpha('es-ES', {ignore: ' '}).not().isEmpty().isLength({min: 3, max: 25}),
    body('coverImage'),
    body('userName').trim().escape().isAlphanumeric().isLength({min: 4, max: 10}).not().isEmpty(),
    body('password').not().isEmpty().isStrongPassword({minSymbols: 0}),
    body('email').trim().escape().isEmail().not().isEmpty(),
    validateEmail,
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
