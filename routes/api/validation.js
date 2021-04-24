const Joi = require('joi')
const myCustomJoi = Joi.extend(require('joi-phone-number'))

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .optional(),
  phone: myCustomJoi
    .string()
    .phoneNumber({ defaultCountry: 'UA', format: 'international' })
    .required(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .optional(),
  phone: myCustomJoi
    .string()
    .phoneNumber({ defaultCountry: 'UA', format: 'international' })
    .optional(),
}).min(1)

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
module.exports.createContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next)
}
module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
