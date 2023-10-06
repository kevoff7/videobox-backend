import { DataTypes } from 'sequelize'
import { Videos } from './videos'

import sequelize from '../database/database'

export const Users = sequelize.define(
  'users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    urlimage: {
      type: DataTypes.STRING
    },
    follows: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    liked_videos: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
  },
  {
    timestamps: false
  }
)

Users.hasMany(Videos, {
  foreignKey: 'id',
  sourceKey: 'id'
})
Videos.belongsTo(Users, { foreignKey: 'id', targetKey: 'id' })
