"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const secret = config_1.jwtEnv.secret_seed;
const validateJWT = (req, res, next) => {
    const token = req.header('x-token');
    if (token == null) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay token en la peticion'
        });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, secret);
        req.user = user;
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'Token no valido'
        });
    }
    return next();
};
exports.default = validateJWT;
