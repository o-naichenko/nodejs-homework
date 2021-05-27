const { User, users } = require('./data')

const findById = jest.fn((id) => {
  // return await User.findOne({ _id: id })
  const [user] = users.filter((el) => String(el.id) === String(id))
  return user
})
// const findByEmail = jest.fn((email) => {
//   return await User.findOne({ email })
// })

// const findOne = jest.fn((query) => {
//   return await User.findOne(query)
// })
// const create = jest.fn((data) => {
//   const user = new User(data)
//   return await user.save()
// })
// const update = jest.fn((token, body) => {
//   const result = await User.findOneAndUpdate(
//     { token: token },
//     { ...body },
//     {
//       new: true,
//     }
//   )
//   return result
// })
const updateAvatar = jest.fn((id, avatar, avatarCloudId = null) => {
  // return await User.updateOne({ _id: id }, { avatar })
  const [user] = users.filter((el) => String(el.id) === String(id))
  user.avatar = avatar
  user.avatarCloudId = avatarCloudId
  return user
})
// const updateToken = jest.fn((id, token) => {
//   return await User.updateOne({ _id: id }, { token })
// })

module.exports = {
  // create,
  // findByEmail,
  findById,
  // findOne,
  // update,
  updateAvatar,
  // updateToken,
}
