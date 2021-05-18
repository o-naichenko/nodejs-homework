require('dotenv').config()
const jwt = require('jsonwebtoken')
const usersApi = require('../model/usersApi')
const { HttpCode } = require('../helpers/constants')
const SECRET_KEY = process.env.JWT_SECRET_KEY

const signup = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await usersApi.findByEmail(email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: `Email ${email} is already used`,
      })
    }
    const newUser = await usersApi.create(req.body)

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      message: 'User created',
      data: {
        id: newUser.id,
        email: newUser.email,
      },
    })
  } catch (error) {
    next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await usersApi.findByEmail(email)
    if (!user || !user.validPassword(password)) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Conflict',
        message: 'Invalid credentials',
      })
    }
    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await usersApi.updateToken(id, token)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}
const logout = async (req, res, next) => {
  const id = req.user.id
  await usersApi.updateToken(id, null)
  return res.status(HttpCode.NO_CONTENT).json({})
}

module.exports = { signup, login, logout }
