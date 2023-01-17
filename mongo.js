const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

mongoose.set('strictQuery', false)
mongoose.connect(connectionString, {
  useNewUrlParser: true
})
  .then(() => {
    console.log('Connected to database')
  })
  .catch(err => {
    console.log(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
