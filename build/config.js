"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbprod = exports.jwtEnv = exports.server = exports.db = void 0;
require("dotenv/config");
exports.db = { port: process.env.portDataBase, user: process.env.user, password: process.env.password, host: process.env.host, database: process.env.database };
exports.server = { port: process.env.PORT };
exports.jwtEnv = { secret_seed: process.env.SECRET_JWT_SEED };
exports.dbprod = { renderUrl: process.env.DBConfigLink };
