// const { populate } = require('./schemas/contact')
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

const getListOfContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    favorite,
    limit = '20',
    page = '1',
  } = query
  // const collection = await getCollection(db, 'contacts')
  // return await collection.find({}).toArray()
  const options = { owner: userId }
  if (favorite) {
    options.favorite = { $all: [favorite] }
  }

  const result = await Contact.paginate(options, {
    limit,
    page,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: 1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: {
      path: 'owner',
      select: 'email -_id',
    },
  })
  const { docs: contacts, totalDocs: total } = result
  return { total: total.toString(), limit, page, contacts }
}

const getContactById = async (id, userId) => {
  // const collection = await getCollection(db, 'contacts')
  // const objectId = new ObjectId(contactId)
  // console.log(objectId.getTimestamp())
  // const [result] = await collection.find({ _id: objectId }).toArray()
  // return result
  return await (
    await Contact.findById(id, { owner: userId })
  ).populate({ path: 'owner', select: 'email -_id' })
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

const updateContact = async (id, body, userId) => {
  // const collection = await getCollection(db, 'contacts')
  // const objectId = new ObjectId(contactId)
  // const { value: result } = await collection.findOneAndUpdate(
  //   { _id: objectId },
  //   { $set: body },
  //   { returnOriginal: false }
  // )
  const result = await Contact.findByIdAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  )
  return result
}

const removeContact = async (id, userId) => {
  // const collection = await getCollection(db, 'contacts')
  // const objectId = new ObjectId(contactId)
  // const { value: result } = await collection.findOneAndDelete(
  //   { _id: objectId },
  //   { returnOriginal: false }
  // )
  const result = await Contact.findByIdAndRemove({ _id: id, owner: userId })
  return result
}

module.exports = {
  getListOfContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
