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
  owner: Joi.string().alphanum().min(3).max(30).required(),
  favorite: Joi.bool(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .optional(),
  phone: myCustomJoi
    .string()
    .phoneNumber({ defaultCountry: 'UA', format: 'international' })
    .optional(),
  favourite: Joi.bool().default(false),
}).min(1)

const schemaContactQuery = Joi.object({
  sortBy: Joi.string().valid('name', 'email', 'phone', 'id').optional(),
  sortByDesc: Joi.string().valid('name', 'email', 'phopne', 'id').optional(),
  filter: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(20).optional(),
  offset: Joi.number().integer().min(0).optional(),
}).without('sotBy', 'sortByDesc')

const schemaUpdateContactStatus = Joi.object({
  favorite: Joi.bool(),
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

module.exports.createContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next)
}
module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
module.exports.updateContactStatus = (req, res, next) => {
  return validate(schemaUpdateContactStatus, req.body, next)
}
module.exports.contactQuery = (req, res, next) => {
  return validate(schemaContactQuery, req.query, next)
}
