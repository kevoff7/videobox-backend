import { Router } from 'express'
import validateJWT from '../middlewares/validar-jwt'
import { createEvents, createLikeEvent, deleteEvents, getEvents, publishedEvent, updateEvents } from '../controllers/events'
import { schemaValidation } from '../middlewares/schemaValidator'
import { createEventsSchema, createLikeEventsSchema, deleteEventsSchema, publishedEventSchema, updateEventsSchema } from '../schemas/eventsSchema'

const router = Router()

router.use(validateJWT)

router.get('/', getEvents)
router.post('/', schemaValidation(createEventsSchema), createEvents)
router.post('/like/:id', schemaValidation(createLikeEventsSchema), createLikeEvent)
router.put('/published/:id', schemaValidation(publishedEventSchema), publishedEvent)
router.put('/:id', schemaValidation(updateEventsSchema), updateEvents)
router.delete('/:id', schemaValidation(deleteEventsSchema), deleteEvents)

export default router
