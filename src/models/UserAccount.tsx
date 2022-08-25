import { UserRoles } from '../utils/commonUtils'

export interface UserAccount {
  isVerified: boolean
  role: UserRoles
  username: string
}
