require('dotenv').config()
const jwt = require('jsonwebtoken')
const jimp = require('jimp')
const fs = require('fs/promises')
const path = require('path')
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
        avatar: newUser.avatar,
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
        message: 'Email or password is wrong',
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
const getCurrent = async (req, res, next) => {
  try {
    const user = await usersApi.findOne({ token: req.user.token })
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Conflict',
        message: 'Not authorized',
      })
    }
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        email: user.email,
        subscription: user.subscription,
        avatar: user.avatar,
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
const update = async (req, res, next) => {
  try {
    const user = await usersApi.update(req.user.token, req.body)
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Conflict',
        message: 'Not authorized',
      })
    }
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'User updated',
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    })
  } catch (error) {
    next(error)
  }
}
const updateAvatar = async (req, res, next) => {
  const { id } = req.user
  const avatarUrl = await saveUserAvatar(req)
  await usersApi.updateAvatar(id, avatarUrl)
  return res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } })
}

const saveUserAvatar = async (req) => {
  const AVATARS_FOLDER = process.env.AVATARS_FOLDER
  const filePath = req.file.path
  const newAvatarName = `${Date.now().toString()}-${req.file.originalname}`
  const img = await jimp.read(filePath)
  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(filePath)
  try {
    await fs.rename(
      filePath,
      path.join(process.cwd(), 'public', AVATARS_FOLDER, newAvatarName)
    )
  } catch (e) {
    console.log(e.message)
  }
  const prevAvatar = req.user.avatar
  if (prevAvatar.includes(`${AVATARS_FOLDER}/`)) {
    await fs.unlink(path.join(process.cwd(), 'public', prevAvatar))
  }
  return path.join(AVATARS_FOLDER, newAvatarName).replace('//', '/')
}

module.exports = { getCurrent, login, logout, signup, update, updateAvatar }
