import { Request, Response } from 'express'
import { pool } from '../db'
import { CreateEventSchema, CreateLikeEventsSchemaParams, DeleteEventsSchemaParams, PublishedEventSchemaBody, PublishedEventSchemaParams, UpdateEventsSchemaBody, UpdateEventsSchemaParams } from '../schemas/eventsSchema'
import { parseVideoUrl } from '../helpers/parseVideoUrl'

export const getEvents = async (_: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM videos'
    )
    return res.status(200).json({
      ok: true,
      events: rows
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Please speak to a administrator'
    })
  }
}

export const createEvents = async (req: Request<unknown, unknown, CreateEventSchema>, res: Response) => {
  const { user } = req as any
  const { title, url } = req.body
  try {
    const newUrl = parseVideoUrl(url)
    const { rows } = await pool.query(
      'INSERT INTO videos (url, title,id) VALUES($1, $2, $3) RETURNING *',
      [newUrl, title, user.id]
    )
    return res.json({
      ok: true,
      event: rows[0],
      msg: [{ message: 'Correctly saved' }]
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Please speak to a administrator'
    })
  }
}

export const createLikeEvent = async (req: Request<CreateLikeEventsSchemaParams>, res: Response) => {
  const { user } = req as any
  const { id } = req.params
  try {
    const results = await pool.query('SELECT * FROM users WHERE id = $1 AND $2 = ANY(liked_videos)', [user.id, id])
    if (results.rows.length === 0) {
      try {
        const result = await pool.query('UPDATE users SET liked_videos = array_append(liked_videos, $2) WHERE id = $1 RETURNING *', [user.id, id])
        res.json({
          ok: true,
          likedVideos: result.rows[0].liked_videos,
          msg: 'Saved in the list'
        })
      } catch (error) {
        res.status(500).json({
          ok: false,
          msg: 'Please speak to a administrator'
        })
      }
    } else {
      try {
        const result = await pool.query('UPDATE users SET liked_videos = array_remove(liked_videos, $2) WHERE id = $1 RETURNING *', [user.id, id])
        res.json({
          ok: true,
          likedVideos: result.rows[0].liked_videos,
          msg: 'Deleted from the list'
        })
      } catch (error) {
        res.status(500).json({
          ok: false,
          msg: 'Please speak to a administrator'
        })
      }
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Please speak to a administrator'
    })
  }
}

export const publishedEvent = async (req: Request<PublishedEventSchemaParams, unknown, PublishedEventSchemaBody>, res: Response) => {
  const { user } = req as any
  const { id } = req.params
  const { published, idUser } = req.body
  try {
    const result = await pool.query('SELECT * FROM videos WHERE id_video = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: [{ message: 'Video not found' }] })
    }
    if (idUser !== user.id) {
      return res.status(404).json({ ok: false, msg: [{ message: 'You do not have privileges for  this event' }] })
    }
    const results = await pool.query('UPDATE videos SET published = $1 WHERE id_video = $2 RETURNING *', [published, id])
    if (published) {
      return res.json({
        ok: true,
        video: results.rows[0],
        msg: [{ message: 'Correctly pusblished video ' }]
      })
    }
    if (!published) {
      return res.json({
        ok: true,
        video: results.rows[0],
        msg: [{ message: 'Video successfully unpublished' }]
      })
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Please speak to a administrator'
    })
  }
}

export const updateEvents = async (req: Request<UpdateEventsSchemaParams, unknown, UpdateEventsSchemaBody>, res: Response) => {
  const { user } = req as any
  const { id } = req.params
  const { title, url, idUser } = req.body
  try {
    if (idUser !== user.id) {
      res.status(401).json({
        ok: false,
        msg: 'You do not have privileges to edit this event'
      })
    }
    const newUrl = parseVideoUrl(url)

    const results = await pool.query('UPDATE videos SET url = $1, title = $2 WHERE id_video = $3 RETURNING *', [newUrl, title, id])
    if (results.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        msg: 'Video not found'
      })
    }

    return res.status(200).json({
      ok: true,
      video: results.rows[0],
      msg: [{ message: 'Event successfully edit' }]
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Please speak to a administrator'
    })
  }
}

export const deleteEvents = async (req: Request<DeleteEventsSchemaParams>, res: Response) => {
  const { user } = req as any
  const { id } = req.params
  try {
    const evento = await pool.query('SELECT * FROM videos WHERE id_video = $1', [id])
    if (evento.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        msg: 'Video not found'
      })
    }
    if (user.id !== evento.rows[0].id) {
      res.status(401).json({
        ok: false,
        msg: 'Please speak to a administrator'
      })
    }

    await pool.query('DELETE FROM videos WHERE id_video = $1', [id])

    res.status(200).json({
      ok: true,
      msg: [{ message: 'Correctly deleted' }]
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Please speak to a administrator'
    })
  }
}
