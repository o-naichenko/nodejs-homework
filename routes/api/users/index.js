const express = require('express')
const usersRouter = express.Router()
// const validate = require('./validation')
const userController = require('../../../controllers/users')

usersRouter.post('/registration', userController.reg)
usersRouter.post('/login', userController.login)
usersRouter.post('/logout', userController.logout)
module.exports = usersRouter
