const app = require('../app')
// const contactsApi = require('../model/index')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`)
})
