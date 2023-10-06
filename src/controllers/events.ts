import { Request, Response } from 'express'
import { CreateEventSchema, CreateLikeEventsSchemaParams, DeleteEventsSchemaParams, PublishedEventSchemaBody, PublishedEventSchemaParams, UpdateEventsSchemaBody, UpdateEventsSchemaParams } from '../schemas/eventsSchema'
import { parseVideoUrl } from '../helpers/parseVideoUrl'
import { Videos } from '../models/videos'
import { Users } from '../models/users'

export const getEvents = async (_: Request, res: Response) => {
  try {
    const videos = await Videos.findAll({
      attributes: ['id_video', 'url', 'title', 'published', 'id', 'createdAt'],
      order: [['id_video', 'ASC']]
    })
    const allVideos = videos.map(item => item.dataValues)
    return res.status(200).json({
      ok: true,
      events: allVideos
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
    const newVideo = await Videos.create({
      title, url: newUrl, id: user.id
    }, { fields: ['title', 'url', 'id'] })
    return res.json({
      ok: true,
      event: newVideo.dataValues,
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
    const results: any = await Users.findOne({
      where: {
        id: user.id
      }
    })

    if (results?.dataValues.liked_videos == null || results.dataValues.liked_videos.includes(Number(id)) === false) {
      try {
        if (results?.dataValues.liked_videos == null) {
          results.liked_videos = [Number(id)]
        } else {
          results.liked_videos = [...results.dataValues.liked_videos, Number(id)]
        }
        await results.save()
        res.json({
          ok: true,
          likedVideos: results.dataValues.liked_videos,
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
        const likedVideos = results.liked_videos.filter((vid: any) => (vid !== Number(id)))
        if (likedVideos.length === 0) {
          results.liked_videos = null
        } else {
          results.liked_videos = likedVideos
        }
        await results.save()

        res.json({
          ok: true,
          likedVideos: results.dataValues.liked_videos,
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
    const result: any = await Videos.findOne({
      where: {
        id_video: id
      }
    })
    if (result == null) {
      return res.status(404).json({ ok: false, msg: [{ message: 'Video not found' }] })
    }
    if (idUser !== user.id) {
      return res.status(404).json({ ok: false, msg: [{ message: 'You do not have privileges for  this event' }] })
    }

    result.published = published
    await result.save()

    if (published) {
      return res.json({
        ok: true,
        video: result.dataValues,
        msg: [{ message: 'Correctly pusblished video' }]
      })
    }
    if (!published) {
      return res.json({
        ok: true,
        video: result.dataValues,
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

    const results: any = await Videos.findOne({
      where: { id_video: id }
    })
    if (results != null) {
      results.url = newUrl
      results.title = title

      await results.save()
    } else {
      return res.status(401).json({
        ok: false,
        msg: 'Video not found'
      })
    }

    return res.status(200).json({
      ok: true,
      video: results.dataValues,
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
    const evento = await Videos.findOne({
      where: { id_video: id }
    })
    if (evento == null) {
      return res.status(401).json({
        ok: false,
        msg: 'Video not found'
      })
    }
    if (user.id !== evento.dataValues.id) {
      res.status(401).json({
        ok: false,
        msg: 'You do not have privileges to edit this event'
      })
    }

    await Videos.destroy({
      where: { id_video: id }
    })

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
