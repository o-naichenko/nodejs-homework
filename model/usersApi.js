const User = require('./schemas/user')

const findByEmail = async (email) => {
  return await User.findOne({ email })
}
const findById = async (id) => {
  return await User.findOne({ _id: id })
}

const findByVerifyEmailToken = async (token) => {
  return await User.findOne({ verifyEmailToken: token })
}

const findOne = async (query) => {
  return await User.findOne(query)
}
const create = async (data) => {
  const user = new User(data)
  return await user.save()
}
const update = async (token, body) => {
  const result = await User.findOneAndUpdate(
    { token: token },
    { ...body },
    {
      new: true,
    }
  )
  return result
}
const updateAvatar = async (id, avatar, avatarCloudId = null) => {
  return await User.updateOne({ _id: id }, { avatar, avatarCloudId })
}
const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.updateOne(
    { _id: id },
    { verify, verifyEmailToken: verifyToken }
  )
}

module.exports = {
  create,
  findByEmail,
  findById,
  findByVerifyEmailToken,
  findOne,
  update,
  updateAvatar,
  updateToken,
  updateVerifyToken,
}
