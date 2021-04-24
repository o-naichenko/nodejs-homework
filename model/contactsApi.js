// const fs = require('fs/promises')
// const contacts = require('./contacts.json')
const { v4: uuid } = require('uuid')
const db = require('./db')

const getListOfContacts = async () => {
  return await db.get('contacts').value()
}

const getContactById = async (contactId) => {
  return await db.get('contacts').find({ id: contactId }).value()
}

const removeContact = async (contactId) => {
  return await db.get('contacts').remove({ id: contactId }).write()
}

const addContact = async (body) => {
  const id = uuid()
  const newContact = {
    id,
    ...body,
  }
  await db.get('contacts').push(newContact).write()
  return newContact
}

const updateContact = async (contactId, body) => {
  const record = await db
    .get('contacts')
    .find({ id: contactId })
    .assign(body)
    .value()
  await db.write()
  return record.id ? record : null
}

module.exports = {
  getListOfContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
