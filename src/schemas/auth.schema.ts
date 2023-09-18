import { z } from 'zod'

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Mail is required' }).email({ message: 'The mail is incorrect' }),
    password: z.string({ required_error: 'Passsword is required' }).min(6, { message: 'Password must be 6 characters o more' }),
    confirmedPassword: z.string({ required_error: 'Password confirmation is required' }).min(6, { message: 'Password must be 6 character o more' })
  })
})

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Mail is required' }).email({ message: 'Mail is incorrect' }),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be 6 character o more')

  })
})

export const updateImageUserSchema = z.object({
  body: z.object({
    url: z.string({ required_error: 'Url is required' }).url({ message: 'Url incorrect' }).max(255, { message: 'The url must be less than 255 characters' }).or(z.null())
  }),
  params: z.object({
    id: z.string({ required_error: 'id is required' })
  })
})

export type RegisterUserType = z.infer<typeof registerUserSchema>['body']
export type UserTypeLogin = z.infer<typeof loginUserSchema>['body']

export type UpdateImageBodyType = z.infer<typeof updateImageUserSchema>['body']
export type UpdateImageParamsType = z.infer<typeof updateImageUserSchema>['params']
