import jwt from 'jsonwebtoken'
import { jwtEnv } from '../config'

const generateJWT = async (id: string, name: string) => {
  return await new Promise((resolve, reject) => {
    const payload = { id, name }
    jwt.sign(payload, jwtEnv.secret_seed as string, {
      expiresIn: '2h'
    }, (err, token) => {
      if (err !== null) {
        console.log(err)
        reject(new TypeError('No se pudo generar el token'))
      }
      resolve(token)
    })
  })
}
export default generateJWT
