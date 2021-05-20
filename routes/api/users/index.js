const express = require('express')
const usersRouter = express.Router()
const validate = require('./validation')
const usersController = require('../../../controllers/users')
const guard = require('../../../helpers/guard')

usersRouter.post('/signup', validate.signupUser, usersController.signup)
usersRouter.post('/login', validate.loginUser, usersController.login)
usersRouter.get('/current', guard, usersController.getCurrent)
usersRouter.post('/logout', guard, usersController.logout)
usersRouter.patch('/', guard, validate.updateUser, usersController.update)
module.exports = usersRouter
