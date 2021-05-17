require('dotenv').config()
const { HttpCode } = require('../helpers/constants')
const contactsApi = require('../model/contactsApi')

const getAll = async (req, res, next) => {
  try {
    const contacts = await contactsApi.getListOfContacts()
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Contacts list is in data',
      data: { contacts },
    })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const contact = await contactsApi.getContactById(req.params.id)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Requested contact found',
        data: { contact },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: `No contact with id: '${req.params.id}' found`,
      })
    }
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const contact = await contactsApi.addContact(req.body)
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      message: 'Contact added',
      data: { contact },
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const contact = await contactsApi.removeContact(req.params.id)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Contact  deleted',
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const contact = await contactsApi.updateContact(req.params.id, req.body)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Contact  updated',
        data: { contact },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: `No contact with id: '${req.params.id}' found`,
      })
    }
  } catch (error) {
    next(error)
  }
}
const updateStatus = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'No "favorite" field found',
    })
  }
  try {
    const contact = await contactsApi.updateContact(req.params.id, req.body)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Contact status updated',
        data: { contact },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: `No contact with id: '${req.params.id}' found`,
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
