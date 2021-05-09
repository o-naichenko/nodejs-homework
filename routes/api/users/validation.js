const Joi = require('joi')

const schemaValidateUser = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .optional(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
})

const validate = (schema, data, next) => {
  const { error } = schema.validate(data)
  if (error) {
    const [{ message }] = error.details
    next({
      status: 400,
      message:
        error.details[0].type === 'object.min'
          ? 'Missing fields'
          : `${message.replace(/"/g, '')}`,
    })
  }
  next()
}
module.exports.validateUser = (req, res, next) => {
  return validate(schemaValidateUser, req.body, next)
}
