const express = require('express')
const contactsRouter = express.Router()
const contactsApi = require('../../model/contactsApi')
const validate = require('./validation')

contactsRouter.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsApi.getListOfContacts()
    return res
      .status(200)
      .json({
        status: 'success',
        code: 200,
        message: 'Contacts list in data',
        data: { contacts },
      })
  } catch (error) {
    next(error)
  }
})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await contactsApi.getContactById(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Requested contact found',
        data: { contact },
      })
    } else {
      return res
        .status(404)
        .json({
          status: 'error',
          code: 404,
          message: `No contact with id: '${req.params.contactId}' found`,
        })
    }
  } catch (error) {
    next(error)
  }
})

contactsRouter.post('/', validate.createContact, async (req, res, next) => {
  try {
    const contact = await contactsApi.addContact(req.body)
    return res
      .status(201)
      .json({
        status: 'success',
        code: 201,
        message: 'Contact added',
        data: { contact },
      })
  } catch (error) {
    next(error)
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await contactsApi.removeContact(req.params.contactId)
    console.log(contact)
    if (contact.length !== 0) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Contact  deleted',
      })
    } else {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not Found' })
    }
  } catch (error) {
    next(error)
  }
})

contactsRouter.patch(
  '/:contactId',
  validate.updateContact,
  async (req, res, next) => {
    try {
      const contact = await contactsApi.updateContact(
        req.params.contactId,
        req.body
      )
      if (contact) {
        return res.json({
          status: 'success',
          code: 200,
          message: 'Contact  updated',
          data: { contact },
        })
      } else {
        return res
          .status(404)
          .json({
            status: 'error',
            code: 404,
            message: `No contact with id: '${req.params.contactId}' found`,
          })
      }
    } catch (error) {
      next(error)
    }
  }
)

module.exports = contactsRouter
