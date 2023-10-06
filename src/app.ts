import express from 'express'
import cors from 'cors'
import auth from './routes/auth'
import events from './routes/events'

const app = express()

app.use(cors())

// app.use(cors({
//   origin: 'https://video-box-kevoff.vercel.app',
//   credentials: true
// }))

app.use(express.json())

app.use('/api/auth', auth)

app.use('/api/events', events)

app.get('*', (req, res) => {
  res.send('Api rest VideoBox')
})

export default app
