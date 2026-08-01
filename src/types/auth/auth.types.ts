export type LoginDto = {
  email: string
  password: string
}

export type RegisterDto = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type JoinDto = {
  firstName: string
  lastName: string
  email: string
}

export type LoginResponse2 = {
  accessToken: string
}

export type LoginResponse = {
  success: boolean
}

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role?: Role | null
  emailVerified: boolean
  createdAt: Date
}

export type Role = {
  id: number
  name?: string
}

export type Status = {
  id: number
  name?: string
}

export type ChangePasswordDto = {
  currentPassword: string
  newPassword: string
}

export type CreatePasswordDto = {
  password: string

  hash: string
}

export type ConfirmEmailDto = {
  hash: string
}

export type VerifyEmailDto = {
  hash: string
}

export enum RoleEnum {
  'admin' = 1,
  'user' = 2,
}
