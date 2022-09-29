import { AccountCredentials } from './../models/AccountCredentials'
import { ThirdParties } from './commonUtils'

export const getOptionsParams = (account: AccountCredentials | undefined) => {
  let options = {}
  if (account && account.email && account?.password) {
    options = {
      params: {
        user: account.email,
        password: account.password,
      },
    }
  }

  if (account && account.auth && account.token) {
    options = {
      params: {
        auth: account.auth ?? ThirdParties.FACEBOOK,
      },
      headers: {
        Authorization: `Bearer ${account.token}`,
        'Content-Type': 'application/json',
      },
    }
  }

  return options
}
