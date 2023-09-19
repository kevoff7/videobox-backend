"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
// import { db } from './config'
// const PORT = db.port ?? 5432
exports.pool = new pg_1.Pool({
    // user: db.user,
    // password: db.password,
    // host: db.host,
    // port: Number(PORT),
    // database: db.database
    connectionString: config_1.dbprod.renderUrl
});
