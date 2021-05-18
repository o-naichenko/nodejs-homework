const express = require('express')
const usersRouter = express.Router()
// const validate = require('./validation')
const usersController = require('../../../controllers/users')
const guard = require('../../../helpers/guard')

usersRouter.post('/signup', usersController.signup)
usersRouter.post('/login', usersController.login)
usersRouter.get('/current', guard, usersController.getCurrent)
usersRouter.post('/logout', guard, usersController.logout)
module.exports = usersRouter
