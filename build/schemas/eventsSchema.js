"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLikeEventsSchema = exports.deleteEventsSchema = exports.updateEventsSchema = exports.publishedEventSchema = exports.createEventsSchema = void 0;
const zod_1 = require("zod");
exports.createEventsSchema = zod_1.z.object({
    body: zod_1.z.object({
        url: zod_1.z.string({ required_error: 'Url es required' }).url({ message: 'Url incorrect' }).max(255, { message: 'The url must be less than 255 characters' }),
        title: zod_1.z.string({ required_error: 'Title is required' }).min(3, { message: 'Title must be have 3 characters o more' })
    })
});
exports.publishedEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        published: zod_1.z.boolean({ required_error: 'Value must be boolean' }),
        idUser: zod_1.z.number({ required_error: 'User id is required' })
    }),
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'The value must be a string' })
    })
});
exports.updateEventsSchema = zod_1.z.object({
    body: zod_1.z.object({
        url: zod_1.z.string({ required_error: 'The url is required' }).url({ message: 'Incorrect Url' }).max(255, { message: 'The url must be less than 255 characters' }),
        title: zod_1.z.string({ required_error: 'The title is required' }).min(3, { message: 'the title must be 3 characters or more' }),
        idUser: zod_1.z.number({ required_error: 'The idUser is required' })
    }),
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'The value must be a number' })
    })
});
exports.deleteEventsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'The id is required' })
    })
});
exports.createLikeEventsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'The id is required' })
    })
});
