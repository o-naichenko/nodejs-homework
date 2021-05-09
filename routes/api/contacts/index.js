const express = require('express')
const contactsRouter = express.Router()
// const contactsApi = require('../../model/contactsApi')
const validate = require('./validation')
const contactsController = require('../../../controllers/contacts')

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', contactsController.getById)

contactsRouter.post('/', validate.createContact, contactsController.create)

contactsRouter.delete('/:contactId', contactsController.remove)

contactsRouter.patch(
  '/:contactId',
  validate.updateContact,
  contactsController.update
)

contactsRouter.patch(
  '/:contactId/favorite',
  validate.updateContactStatus,
  contactsController.updateStatus
)
module.exports = contactsRouter
