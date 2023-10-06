import app from './app'

import { server } from './config'
import sequelize from './database/database'

const PORT = server.port ?? 3000

async function main () {
  try {
    await sequelize.sync({ force: false })
    app.listen(PORT, () => {
      console.log(`Service running in port ${PORT}`)
    })
  } catch (error) {
    console.log('fallo la db')
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
