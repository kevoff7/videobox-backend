"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const sequelize_1 = require("sequelize");
const videos_1 = require("./videos");
const database_1 = __importDefault(require("../database/database"));
exports.Users = database_1.default.define('users', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    urlimage: {
        type: sequelize_1.DataTypes.STRING
    },
    follows: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER)
    },
    liked_videos: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER)
    }
}, {
    timestamps: false
});
exports.Users.hasMany(videos_1.Videos, {
    foreignKey: 'id',
    sourceKey: 'id'
});
videos_1.Videos.belongsTo(exports.Users, { foreignKey: 'id', targetKey: 'id' });
