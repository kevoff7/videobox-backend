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

// Si no ingresa a la rutas de arriba que venga a buscar esto
app.get('*', (req, res) => {
  // eslint-disable-next-line n/no-path-concat
  res.sendFile(__dirname + '/public/index.html')
})

app.listen(PORT, () => {
  console.log(`Service running in port ${PORT}`)
})
