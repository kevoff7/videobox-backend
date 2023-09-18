import { z } from 'zod'

export const createEventsSchema = z.object({
  body: z.object({
    url: z.string({ required_error: 'Url es required' }).url({ message: 'Url incorrect' }).max(255, { message: 'The url must be less than 255 characters' }),
    title: z.string({ required_error: 'Title is required' }).min(3, { message: 'Title must be have 3 characters o more' })
  })
})

export type CreateEventSchema = z.infer<typeof createEventsSchema>['body']

export const publishedEventSchema = z.object({
  body: z.object({
    published: z.boolean({ required_error: 'Value must be boolean' }),
    idUser: z.number({ required_error: 'User id is required' })
  }),
  params: z.object({
    id: z.string({ required_error: 'The value must be a string' })
  })
})

export type PublishedEventSchemaBody = z.infer<typeof publishedEventSchema>['body']
export type PublishedEventSchemaParams = z.infer<typeof publishedEventSchema>['params']

export const updateEventsSchema = z.object({
  body: z.object({
    url: z.string({ required_error: 'The url is required' }).url({ message: 'Incorrect Url' }).max(255, { message: 'The url must be less than 255 characters' }),
    title: z.string({ required_error: 'The title is required' }).min(3, { message: 'the title must be 3 characters or more' }),
    idUser: z.number({ required_error: 'The idUser is required' })
  }),
  params: z.object({
    id: z.string({ required_error: 'The value must be a number' })
  })
})

export type UpdateEventsSchemaBody = z.infer<typeof updateEventsSchema>['body']
export type UpdateEventsSchemaParams = z.infer<typeof updateEventsSchema>['params']

export const deleteEventsSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'The id is required' })
  })
})

export const createLikeEventsSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'The id is required' })
  })
})

export type DeleteEventsSchemaParams = z.infer<typeof deleteEventsSchema>['params']

export type CreateLikeEventsSchemaParams = z.infer<typeof createLikeEventsSchema>['params']
