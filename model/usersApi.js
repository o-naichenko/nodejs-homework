const User = require('./schemas/user')

const findByEmail = async (email) => {
  return await User.findOne({ email })
}
const findById = async (id) => {
  return await User.findOne({ _id: id })
}
const findOne = async (query) => {
  return await User.findOne(query)
}
const create = async ({ email, password }) => {
  const user = new User({ email, password })
  return await user.save()
}
const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

module.exports = {
  create,
  findByEmail,
  findById,
  findOne,
  updateToken,
}
