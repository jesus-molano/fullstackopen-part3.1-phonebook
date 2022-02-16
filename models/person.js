import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const url = process.env.MONGODB_URI
console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('DB conected');
  }).catch(err => {
    console.error('error connecting to DB', err.message);
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      minlength: 3,
      required: true
    },
    number: { 
      type: String,
      minlength: 8,
      required: true
    },
  })
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  personSchema.plugin(uniqueValidator)

export const Person = mongoose.model('Person', personSchema)