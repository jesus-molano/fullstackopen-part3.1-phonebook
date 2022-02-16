import express from "express";
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config' 
import {Person} from './models/person.js'



const app = express();
app.use(express.json())

app.use(cors())

app.use(express.static('build'))


morgan.token('data', (req)=> {
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

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => res.json(person))
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(404).json({error:'content missing'})
  
  const person = new Person({name,number})

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.put('/api/persons/:id', (req, res) => {
  const { number } = req.body
  Person.findByIdAndUpdate(req.params.id, {number}, {new:true} )
    .then(updatedPerson => res.status(201).json(updatedPerson))
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(person => {
      res.status(204).end()
    })
})



app.get('/info', (req, res) => {
  const entries = Person.length
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${entries} people</p>
    <p>${date}</p>`
  )
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})