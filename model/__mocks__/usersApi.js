const { User, users } = require('./data')

const findById = jest.fn((id) => {
  // return await User.findOne({ _id: id })
  const [user] = users.filter((el) => String(el.id) === String(id))
  return user
})

module.exports = findById
