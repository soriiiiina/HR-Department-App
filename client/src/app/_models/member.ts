import { Photo } from "./photo"
import { Role } from "./role"


export interface Member {
  id: number
  fullName: string
  username: string
  photoUrl: string
  statusOrQuote: string
  phoneNumber: string
  faculty: string
  age: number
  created: Date
  lastActive: Date
  photo: Photo[]
  userRoles: Role[]
}


