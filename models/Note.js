const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)
module.exports = Note

// Note.find({}).then(result => {
//   console.log(result)
// })

// const note = new Note({
//   content: 'Hello world',
//   date: new Date(),
//   important: true
// })

// note.save()
//   .then(note => {
//     console.log(note)
//     mongoose.connection.close()
//   })
//   .catch((err) => {
//     console.error(err)
//   })
