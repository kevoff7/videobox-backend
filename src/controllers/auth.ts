import { Request, Response } from 'express'
import { RegisterUserType, UpdateImageBodyType, UpdateImageParamsType, UserTypeLogin } from '../schemas/auth.schema'
import bcrypt from 'bcryptjs'
import generateJWT from '../helpers/jwt'
import { Users } from '../models/users'

export const createUser = async (req: Request<unknown, unknown, RegisterUserType>, res: Response) => {
  const { name, email, password, confirmedPassword } = req.body
  try {
    const user = await Users.findOne({
      where: {
        email
      }
    })
    if (user?.dataValues.email === email) {
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

    const newUser = await Users.create({
      name, email, password: encryptedPassword
    }, { fields: ['name', 'email', 'password'] })
    const token = await generateJWT(newUser.dataValues.id, newUser.dataValues.name)
    return res.status(201).json({
      ok: true,
      name: newUser.dataValues.name,
      id: newUser.dataValues.id,
      urlimage: newUser.dataValues.urlimage,
      follows: newUser.dataValues.follows,
      liked_videos: newUser.dataValues.liked_videos,
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
    const user = await Users.findOne({
      where: {
        email
      }
    })
    if (user?.dataValues.email == null) {
      return res.status(400).json({
        ok: false,
        msg: [{ message: 'There is no user with email' }]
      })
    }
    const validPassword = bcrypt.compareSync(password, user?.dataValues.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: [{ message: 'Password incorrect' }]
      })
    }
    const token = await generateJWT(user?.dataValues.id, user?.dataValues.name)
    return res.status(201).json({
      ok: true,
      id: user?.dataValues.id,
      name: user?.dataValues.name,
      urlimage: user?.dataValues.urlimage,
      follows: user?.dataValues.follows,
      liked_videos: user?.dataValues.liked_videos,
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
  const result = await Users.findOne({ where: { id } })
  return res.json({
    ok: true,
    id: result?.dataValues.id,
    name,
    urlimage: result?.dataValues.urlimage,
    follows: result?.dataValues.follows,
    liked_videos: result?.dataValues.liked_videos,
    token
  })
}

export const addUrlImage = async (req: Request<UpdateImageParamsType, unknown, UpdateImageBodyType>, res: Response) => {
  const { user } = req as any
  const { id } = req.params
  const { url } = req.body
  try {
    const updateEvent: any = await Users.findByPk(id)
    if (updateEvent != null) {
      if (id !== String(user.id)) {
        return res.status(404).json({ ok: false, msg: [{ message: 'You do not have editing privileges for this event' }] })
      }
      updateEvent.urlimage = url
      await updateEvent.save()
    } else {
      return res.status(404).json({ ok: false, msg: [{ message: 'User not found' }] })
    }
    if (url === null) {
      return res.json({
        ok: true,
        img: updateEvent.dataValues.urlimage,
        msg: 'Correctly remove'
      })
    }
    return res.json({
      ok: true,
      img: updateEvent.dataValues.urlimage,
      msg: 'Corecctly saved'
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Please speak to a administrator'
    })
  }
}
