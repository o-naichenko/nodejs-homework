const { Schema, model } = require('mongoose')

const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const { Subscription } = require('../../helpers/constants')
const { nanoid } = require('nanoid')
const SALT_WORK_FACTOR = 8

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/
        return re.test(String(value).toLowerCase())
      },
    },
    password: {
      type: String,
      required: [true, 'Password required'],
    },
    subscription: {
      type: String,
      enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
    },
    token: {
      type: String,
      defalut: null,
    },
    name: {
      type: String,
      default: 'Guest',
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true)
      },
    },
    avatarCloudId: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyEmailToken: {
      type: String,
      required: true,
      default: nanoid(),
    },
  },
  { versionKey: false, timestamps: true }
)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
  this.password = await bcrypt.hash(this.password, salt, null)
  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
// userSchema.path('email').validate(function (value) {
//   const re = /\S+@\S+\.\S+/
//   return re.test(String(value).toLowerCase())
// })

const User = model('user', userSchema)
module.exports = User
