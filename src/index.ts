import express from 'express'
import auth from './routes/auth'
import events from './routes/events'
import { server } from './config'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', auth)

app.use('/api/events', events)

app.get('*', (req, res) => {
  res.send('Api rest VideoBox')
})

const PORT = server.port ?? 3000

app.listen(PORT, () => {
  console.log(`Service running in port ${PORT}`)
})
