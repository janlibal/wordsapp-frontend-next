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

export type LoginResponse = {
  accessToken: string
}

export type User = {
  id: string,
  firstName: string
  lastName: string
  email: string
  password: string
}
