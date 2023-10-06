import { Sequelize } from 'sequelize'
import { db } from '../config'

const sequelize = new Sequelize(`postgresql://${db.user as string}:${db.password as string}@${db.host as string}:${db.port as string}/${db.database as string}`, {
  logging: false,
  dialect: 'postgres'
})

export default sequelize
