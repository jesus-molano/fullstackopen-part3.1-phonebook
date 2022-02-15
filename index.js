import express from "express";
import morgan from 'morgan'
import cors from 'cors'


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

const app = express();

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

morgan.token('data', (req)=> {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (req, res) => {
  res.send('<h2>Phonebook Backend</h2>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id);
  person
    ? res.json(person)
    : res.status(404).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(404).json({error:'content missing'})
  
  const repeated = persons.find(person => person.name === name)
  if (repeated) return res.status(400).json({ error: 'name must be unique' })
  
  const person = {
    name,
    number,
    id: Date.now()
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id);
  res.status(204).end()
})

app.get('/info', (req, res) => {
  const entries = persons.length
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${entries} people</p>
    <p>${date}</p>`
  )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})