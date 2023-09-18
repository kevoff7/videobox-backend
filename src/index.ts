import express from 'express'
import auth from './routes/auth'
import events from './routes/events'
import { server } from './config'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', auth)

app.use('/api/events', events)

const PORT = server.port ?? 3000

app.listen(PORT, () => {
  console.log(`Service running in port ${PORT}`)
})
