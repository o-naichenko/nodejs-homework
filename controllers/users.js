require('dotenv').config()
const jwt = require('jsonwebtoken')
// const jimp = require('jimp')
const fs = require('fs/promises')
// const path = require('path')
const { promisify } = require('util')
const cloudinary = require('cloudinary').v2
const usersApi = require('../model/usersApi')
const { HttpCode } = require('../helpers/constants')
const { unlink } = require('fs')

const SECRET_KEY = process.env.JWT_SECRET_KEY

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

const uploadToCloud = promisify(cloudinary.uploader.upload)

const updateAvatar = async (req, res, next) => {
  const { id } = req.user
  // const avatarUrl = await saveUserAvatar(req)
  const { avatarCloudId, avatarUrl } = await saveAvatarToCloudinary(req)
  
  await usersApi.updateAvatar(id, avatarUrl, avatarCloudId)
  return res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } })
}
// const saveUserAvatar = async (req) => {
//   const AVATARS_FOLDER = process.env.AVATARS_FOLDER
//   const filePath = req.file.path
//   const newAvatarName = `${Date.now().toString()}-${req.file.originalname}`
//   const img = await jimp.read(filePath)
//   await img
//     .autocrop()
//     .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
//     .writeAsync(filePath)
//   try {
//     await fs.rename(
//       filePath,
//       path.join(process.cwd(), 'public', AVATARS_FOLDER, newAvatarName)
//     )
//   } catch (e) {
//     console.log(e.message)
//   }
//   const prevAvatar = req.user.avatar
//   if (prevAvatar.includes(`${AVATARS_FOLDER}/`)) {
//     await fs.unlink(path.join(process.cwd(), 'public', prevAvatar))
//   }
//   return path.join(AVATARS_FOLDER, newAvatarName).replace('//', '/')
// }
const saveAvatarToCloudinary = async (req) => {
  const filePath = req.file.path
  
  // const { public_id: avatarCloudId, secure_url: avatarUrl } =
  const { public_id: avatarCloudId, secure_url: avatarUrl } =
    await uploadToCloud(filePath, {
      public_id: req.user.avatarCloudId?.replace('avatars/', ''),
      folder: 'avatars',
      transformation: { width: 250, height: 250, crop: 'pad' },
    })
  await fs.unlink(filePath)

  return { avatarCloudId, avatarUrl }
}

module.exports = { getCurrent, login, logout, signup, update, updateAvatar }
