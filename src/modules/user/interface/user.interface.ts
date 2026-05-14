export interface CreateUser {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface GetUser {
  email?: string
  firstName?: string
  lastName?: string
}

export interface UpdateUser {
  firstName?: string
  lastName?: string
  password?: string
  isEmailVerified?: boolean
  isActive?: boolean
  lastLoginAt?: Date
}

export interface GetUserByEmail {
  email: string
}