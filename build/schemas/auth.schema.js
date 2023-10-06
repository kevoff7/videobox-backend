"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImageUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        email: zod_1.z.string({ required_error: 'Mail is required' }).email({ message: 'The mail is incorrect' }),
        password: zod_1.z.string({ required_error: 'Passsword is required' }).min(6, { message: 'Password must be 6 characters o more' }),
        confirmedPassword: zod_1.z.string({ required_error: 'Password confirmation is required' }).min(6, { message: 'Password must be 6 character o more' })
    })
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Mail is required' }).email({ message: 'Mail is incorrect' }),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(6, 'Password must be 6 character o more')
    })
});
exports.updateImageUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        url: zod_1.z.string({ required_error: 'Url is required' }).url({ message: 'Url incorrect' }).max(255, { message: 'The url must be less than 255 characters' }).or(zod_1.z.null())
    }),
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'id is required' })
    })
});
