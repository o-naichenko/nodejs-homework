const Contact = require('./schemas/contact')
// const fs = require('fs/promises')
// const contacts = require('./contacts.json')
// const { v4: uuid } = require('uuid')

// const db = require('./db')
// const { ObjectId } = require('mongodb')

// const getCollection = async (db, name) => {
//   const client = await db
//   return await client.db().collection(name)
// }

const getListOfContacts = async () => {
  // const collection = await getCollection(db, 'contacts')
  // return await collection.find({}).toArray()
  return await Contact.find({})
}

const getContactById = async (contactId) => {
  // const collection = await getCollection(db, 'contacts')
  // const objectId = new ObjectId(contactId)
  // console.log(objectId.getTimestamp())
  // const [result] = await collection.find({ _id: objectId }).toArray()
  // return result
  return await Contact.findOne({ _id: contactId })
}

const addContact = async (body) => {
  // const newContact = {
  //   ...body,
  // }
  // // db.get('contacts').push(newContact).write()
  // const collection = await getCollection(db, 'contacts')
  // const {
  //   ops: [result],
  // } = await collection.insertOne(newContact)
  const result = Contact.create(body)
  return result
}

const updateContact = async (contactId, body) => {
  // const collection = await getCollection(db, 'contacts')
  // const objectId = new ObjectId(contactId)
  // const { value: result } = await collection.findOneAndUpdate(
  //   { _id: objectId },
  //   { $set: body },
  //   { returnOriginal: false }
  // )
  const result = await Contact.findByIdAndUpdate(contactId, body, { new: true })
  return result
}

const removeContact = async (contactId) => {
  // const collection = await getCollection(db, 'contacts')
  // const objectId = new ObjectId(contactId)
  // const { value: result } = await collection.findOneAndDelete(
  //   { _id: objectId },
  //   { returnOriginal: false }
  // )
  const result = await Contact.findByIdAndRemove({ _id: contactId })
  return result
}

module.exports = {
  getListOfContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
