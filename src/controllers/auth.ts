import { Request, Response } from 'express'
import { RegisterUserType, UpdateImageBodyType, UpdateImageParamsType, UserTypeLogin } from '../schemas/auth.schema'
import bcrypt from 'bcryptjs'
import generateJWT from '../helpers/jwt'
import { pool } from '../db'

export const createUser = async (req: Request<unknown, unknown, RegisterUserType>, res: Response) => {
  const { name, email, password, confirmedPassword } = req.body
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (user.rows.length !== 0) {
      return res.status(400).json({
        ok: false,
        msg: [{ message: 'A user exists with this email' }]
      })
    }
    if (password !== confirmedPassword) {
      return res.status(400).json({
        ok: false,
        msg: [{ message: 'Passwords are not the same' }]
      })
    }
    const salt = bcrypt.genSaltSync()
    const encryptedPassword = bcrypt.hashSync(password, salt)

    const { rows } = await pool.query(
      'INSERT INTO users (email, password, name) VALUES($1, $2, $3) RETURNING *',
      [email, encryptedPassword, name]
    )
    const token = await generateJWT(rows[0].id, rows[0].name)
    return res.status(201).json({
      ok: true,
      name: rows[0].name,
      id: rows[0].id,
      urlimage: rows[0].urlimage,
      follows: rows[0].follows,
      liked_videos: rows[0].liked_videos,
      token
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: [{ message: 'Please speak to an administrator' }]
    })
  }
}

export const loginUser = async (req: Request<unknown, unknown, UserTypeLogin>, res: Response) => {
  const { email, password } = req.body
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (rows.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: [{ message: 'There is no user with email' }]
      })
    }
    const validPassword = bcrypt.compareSync(password, rows[0].password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: [{ message: 'Password incorrect' }]
      })
    }
    const token = await generateJWT(rows[0].id, rows[0].name)
    return res.status(201).json({
      ok: true,
      id: rows[0].id,
      name: rows[0].name,
      urlimage: rows[0].urlimage,
      follows: rows[0].follows,
      liked_videos: rows[0].liked_videos,
      token
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: [{ message: 'Please speak to a administrator' }]
    })
  }
}

export const revalidateJWT = async (req: any, res: Response) => {
  const { id, name } = req.user
  const token = await generateJWT(id, name)
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return res.json({
    ok: true,
    id,
    name,
    urlimage: result.rows[0].urlimage,
    follows: result.rows[0].follows,
    liked_videos: result.rows[0].liked_videos,
    token
  })
}

export const addUrlImage = async (req: Request<UpdateImageParamsType, unknown, UpdateImageBodyType>, res: Response) => {
  const { user } = req as any
  const { id } = req.params
  const { url } = req.body
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: [{ message: 'User not found' }] })
    }
    if (id !== String(user.id)) {
      return res.status(404).json({ ok: false, msg: [{ message: 'You do not have editing privileges for this event' }] })
    }

    const updateEvent = await pool.query('UPDATE users SET urlimage = $1 WHERE id = $2 RETURNING *', [url, id])
    if (url === null) {
      return res.json({
        ok: true,
        img: updateEvent.rows[0].urlimage,
        msg: 'Correctly remove'
      })
    }
    return res.json({
      ok: true,
      img: updateEvent.rows[0].urlimage,
      msg: 'Corecctly saved'
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Please speak to a administrator'
    })
  }
}
