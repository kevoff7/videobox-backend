"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaValidation = void 0;
const zod_1 = require("zod");
const schemaValidation = (schema) => (req, res, next) => {
    try {
        schema.parse({ body: req.body, params: req.params });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                ok: false,
                msg: error.issues.map(item => ({ message: item.message }))
            });
        }
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};
exports.schemaValidation = schemaValidation;
