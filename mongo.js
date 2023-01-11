const mongoose = require('mongoose')

const connectionString = process.env.DB_CONNECTION_STRING

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
