const { Router } = require('express')
const route = Router()
const { body } = require('express-validator')
const { createUser, deleteUser, getUsers } = require('../controllers/users');
const { validateEmail, validateUserName } = require('../helpers/validation');
const { jwtValidator } = require('../middleware/jwt');

route
  .get('/', jwtValidator, getUsers)

route
  .post('/',
    body('email').trim().escape().isEmail().not().isEmpty(),
    body('userName').trim().escape().isAlphanumeric().isLength({min: 4, max: 10}).not().isEmpty(),
    body('name').trim().escape().isAlpha('es-ES', {ignore: ' '}).not().isEmpty().isLength({min: 3, max: 25}),
    body('lastName').trim().escape().isAlpha('es-ES', {ignore: ' '}).not().isEmpty().isLength({min: 3, max: 25}),
    body('password').not().isEmpty().isStrongPassword({minSymbols: 0}),
    validateEmail,
    validateUserName,
    createUser
    )

route
  .delete('/:id', jwtValidator, deleteUser)

module.exports = route
