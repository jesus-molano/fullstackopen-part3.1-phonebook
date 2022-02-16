import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password> '
  )
  process.exit(1)
}
if (process.argv.length > 5 || process.argv.length === 4) {
  console.log(
    'Please provide only the valid arguments: node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jesus-molano:${password}@cluster0.upuq6.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
}
if (process.argv[4]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
