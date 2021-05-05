const contactsApi = require('../model/contactsApi')

const getAll = async (req, res, next) => {
  try {
    const contacts = await contactsApi.getListOfContacts()
    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Contacts list is in data',
      data: { contacts },
    })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
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
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `No contact with id: '${req.params.contactId}' found`,
      })
    }
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const contact = await contactsApi.addContact(req.body)
    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Contact added',
      data: { contact },
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const contact = await contactsApi.removeContact(req.params.contactId)
    if (contact) {
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
}

const update = async (req, res, next) => {
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
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `No contact with id: '${req.params.contactId}' found`,
      })
    }
  } catch (error) {
    next(error)
  }
}
const updateStatus = async (req, res, next) => {
  try {
    const contact = await contactsApi.updateContact(
      req.params.contactId,
      req.body
    )
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Contact status updated',
        data: { contact },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: `No contact with id: '${req.params.contactId}' found`,
      })
    }
  } catch (error) {
    next(error)
  }
}
module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
  updateStatus,
}
