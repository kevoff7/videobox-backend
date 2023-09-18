import { Response, Request, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const schemaValidation = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, params: req.params })
    return next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        msg: error.issues.map(item => ({ message: item.message }))
      })
    }
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }
}
