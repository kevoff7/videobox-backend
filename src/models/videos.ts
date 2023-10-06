import { DataTypes } from 'sequelize'

import sequelize from '../database/database'

export const Videos = sequelize.define(
  'videos', {
    id_video: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false

    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }
)
