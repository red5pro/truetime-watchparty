import { ThirdParties, UserRoles } from '../utils/commonUtils'

export interface UserAccount {
  isVerified: boolean
  role: UserRoles
  username: string
}

export interface ThirdPartyUserAccount {
  role: UserRoles
  name: string
}

export interface ThirdPartyAccount {
  id: string
  token: string
  auth: ThirdParties
}
