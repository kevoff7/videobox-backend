"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const schemaValidator_1 = require("../middlewares/schemaValidator");
const auth_schema_1 = require("../schemas/auth.schema");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const router = (0, express_1.Router)();
router.post('/new', (0, schemaValidator_1.schemaValidation)(auth_schema_1.registerUserSchema), auth_1.createUser);
router.post('/', (0, schemaValidator_1.schemaValidation)(auth_schema_1.loginUserSchema), auth_1.loginUser);
router.get('/renew', validar_jwt_1.default, auth_1.revalidateJWT);
router.put('/:id', validar_jwt_1.default, (0, schemaValidator_1.schemaValidation)(auth_schema_1.updateImageUserSchema), auth_1.addUrlImage);
exports.default = router;
