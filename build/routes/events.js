"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const events_1 = require("../controllers/events");
const schemaValidator_1 = require("../middlewares/schemaValidator");
const eventsSchema_1 = require("../schemas/eventsSchema");
const router = (0, express_1.Router)();
router.use(validar_jwt_1.default);
router.get('/', events_1.getEvents);
router.post('/', (0, schemaValidator_1.schemaValidation)(eventsSchema_1.createEventsSchema), events_1.createEvents);
router.post('/like/:id', (0, schemaValidator_1.schemaValidation)(eventsSchema_1.createLikeEventsSchema), events_1.createLikeEvent);
router.put('/published/:id', (0, schemaValidator_1.schemaValidation)(eventsSchema_1.publishedEventSchema), events_1.publishedEvent);
router.put('/:id', (0, schemaValidator_1.schemaValidation)(eventsSchema_1.updateEventsSchema), events_1.updateEvents);
router.delete('/:id', (0, schemaValidator_1.schemaValidation)(eventsSchema_1.deleteEventsSchema), events_1.deleteEvents);
exports.default = router;
