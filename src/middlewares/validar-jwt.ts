import jwt from 'jsonwebtoken'
import { jwtEnv } from '../config'
import { Response, NextFunction } from 'express'

const secret = jwtEnv.secret_seed as string

const validateJWT = (req: any, res: Response, next: NextFunction) => {
  const token = req.header('x-token')
  if (token == null || token === '') {
    return res.status(401).json({
      ok: false,
      msg: 'no hay token en la peticion'
    })
  }

  try {
    const user = jwt.verify(token, secret)
    req.user = user
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token no valido'
    })
  }

  return next()
}

export default validateJWT
