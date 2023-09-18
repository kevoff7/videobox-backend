"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
const PORT = (_a = config_1.db.port) !== null && _a !== void 0 ? _a : 5432;
exports.pool = new pg_1.Pool({
    user: config_1.db.user,
    password: config_1.db.password,
    host: config_1.db.host,
    port: Number(PORT),
    database: config_1.db.database
});
