"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const sequelize = new sequelize_1.Sequelize(`postgresql://${config_1.db.user}:${config_1.db.password}@${config_1.db.host}:${config_1.db.port}/${config_1.db.database}`, {
    logging: false,
    dialect: 'postgres'
});
exports.default = sequelize;
