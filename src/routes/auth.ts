import { Router } from 'express'
import { addUrlImage, createUser, loginUser, revalidateJWT } from '../controllers/auth'
import { schemaValidation } from '../middlewares/schemaValidator'
import { registerUserSchema, loginUserSchema, updateImageUserSchema } from '../schemas/auth.schema'
import validateJWT from '../middlewares/validar-jwt'

const router = Router()

router.post('/new', schemaValidation(registerUserSchema), createUser)

router.post('/', schemaValidation(loginUserSchema), loginUser)

router.get('/renew', validateJWT, revalidateJWT)

router.put('/:id', validateJWT, schemaValidation(updateImageUserSchema), addUrlImage)

export default router
