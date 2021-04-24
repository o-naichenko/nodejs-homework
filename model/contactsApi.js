// const fs = require('fs/promises')
// const contacts = require('./contacts.json')
// const { v4: uuid } = require('uuid')
const db = require('./db')
const { ObjectId } = require('mongodb')

const getCollection = async (db, name) => {
  const client = await db
  return await client.db().collection(name)
}

const getListOfContacts = async () => {
  const collection = await getCollection(db, 'contacts')
  return await collection.find({}).toArray()
}

const getContactById = async (contactId) => {
  const collection = await getCollection(db, 'contacts')
  const objectId = new ObjectId(contactId)
  // console.log(objectId.getTimestamp())
  const [result] = await collection.find({ _id: objectId }).toArray()
  return result
}

const addContact = async (body) => {
  const newContact = {
    ...body
  }
  // db.get('contacts').push(newContact).write()
  const collection = await getCollection(db, 'contacts')
  const { ops: [result] } = await collection.insertOne(newContact)
  return result
}

const updateContact = async (contactId, body) => {
  const collection = await getCollection(db, 'contacts')
  const objectId = new ObjectId(contactId)
  const { value: result } = await collection.findOneAndUpdate({ _id: objectId }, { $set: body }, { returnOriginal: false })
  return result
}

const removeContact = async (contactId) => {
  const collection = await getCollection(db, 'contacts')
  const objectId = new ObjectId(contactId)
  const { value: result } = await collection.findOneAndDelete({ _id: objectId }, { returnOriginal: false })
  return result
}

module.exports = {
  getListOfContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
