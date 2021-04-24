require('dotenv').config()
const { MongoClient } = require('mongodb')
const uriDb = process.env.URI_DB

const db = MongoClient.connect(uriDb, {
  useUnifiedTopology: true,
  poolSize: 5,
})

process.on('SIGINT', async () => {
  const client = await db
  client.close()
  console.log('connection to db closed, app terminated')
  process.exit(1)
})

module.exports = db
