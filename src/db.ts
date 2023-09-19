import { Pool } from 'pg'
import { dbprod } from './config'
// import { db } from './config'

// const PORT = db.port ?? 5432

export const pool = new Pool({
  // user: db.user,
  // password: db.password,
  // host: db.host,
  // port: Number(PORT),
  // database: db.database
  connectionString: dbprod.renderUrl

})
