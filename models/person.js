import mongoose from 'mongoose'

const url = process.env.MONGODB_URI
console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('DB conected');
  }).catch(err => {
    console.error('error connecting to DB', err.message);
  })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

export const Person = mongoose.model('Person', personSchema)