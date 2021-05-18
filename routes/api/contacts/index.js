const express = require('express')
const contactsRouter = express.Router()
// const contactsApi = require('../../model/contactsApi')
const validate = require('./validation')
const contactsController = require('../../../controllers/contacts')
const guard = require('../../../helpers/guard')

contactsRouter.get('/', guard, contactsController.getAll)

contactsRouter.get('/:id', guard, contactsController.getById)

contactsRouter.post(
  '/',
  guard,
  validate.createContact,
  contactsController.create
)

contactsRouter.delete('/:id', guard, contactsController.remove)

contactsRouter.patch(
  '/:id',
  guard,
  validate.updateContact,
  contactsController.update
)

contactsRouter.patch(
  '/:id/favorite',
  guard,
  validate.updateContactStatus,
  contactsController.updateStatus
)
module.exports = contactsRouter
