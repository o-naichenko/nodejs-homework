const express = require('express')
const usersRouter = express.Router()
const validate = require('./validation')
const usersController = require('../../../controllers/users')
const guard = require('../../../helpers/guard')
const uploadAvatar = require('../../../helpers/uploadAvatar')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 2,
  handler: (req, res, next) => {
    return res.status(429).json({
      status: 'error',
      code: 429,
      message: 'Too many requests',
    })
  },
})

usersRouter.post(
  '/signup',
  limiter,
  validate.signupUser,
  usersController.signup
)
usersRouter.post('/login', validate.loginUser, usersController.login)
usersRouter.get('/current', guard, usersController.getCurrent)
usersRouter.post('/logout', guard, usersController.logout)
usersRouter.patch('/', guard, validate.updateUser, usersController.update)
usersRouter.patch(
  '/avatar',
  guard,
  uploadAvatar.single('avatar'),
  usersController.updateAvatar
)
usersRouter.get('/verify/:token', usersController.verify)
usersRouter.post('/verify', usersController.resendVerifyEmail)
module.exports = usersRouter
