import 'dotenv/config'

export const db = { port: process.env.portDataBase, user: process.env.user, password: process.env.password, host: process.env.host, database: process.env.database }
export const server = { port: process.env.PORT }
export const jwtEnv = { secret_seed: process.env.SECRET_JWT_SEED }
export const dbprod = { renderUrl: process.env.DBConnLink }
