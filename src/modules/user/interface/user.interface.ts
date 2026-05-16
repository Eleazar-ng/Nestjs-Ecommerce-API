import { Role } from "../../../generated/prisma/enums"

export interface CreateUser {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface GetUser {
  id: string
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

export interface GetUsersFilter {
  email?: string | any;
  firstName?: string | any;
  lastName?: string | any;
  role?: Role;
  isEmailVerified?: boolean | any
}