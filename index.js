import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import { Person } from './models/person.js'



const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())



morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (req, res) => {
  res.send('<h2>Phonebook Backend</h2>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      person
        ? res.json(person)
        : res.status(404).end()
    })
    .catch(error => {next(error)})
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  const person = new Person({ name,number })
  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

const options = {
  new: true,
  runValidators: true
}
app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body
  Person.findByIdAndUpdate(req.params.id, { number }, options )
    .then(updatedPerson => res.status(201).json(updatedPerson))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error))
})



app.get('/info', (req, res) => {
  const entries = Person.length
  const date = new Date()
  res.send(
    `<p>Phonebook has info for ${entries} people</p>
    <p>${date}</p>`
  )
})

const unknownEndpoint = (req, res) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error:error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})