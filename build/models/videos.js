"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Videos = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database/database"));
exports.Videos = database_1.default.define('videos', {
    id_video: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    published: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
});
