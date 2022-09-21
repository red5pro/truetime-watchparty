import * as React from 'react'
import { FACEBOOK_APP_ID } from '../../../settings/variables'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import FacebookIcon from '@mui/icons-material/Facebook'
import { isMobileScreen, IStepActionsSubComponent, ThirdParties, UserRoles } from '../../../utils/commonUtils'

import { ThirdPartyAccount, ThirdPartyUserAccount } from '../../../models/UserAccount'
import useCookies from '../../../hooks/useCookies'
import axios from 'axios'

interface IFBSignInProps {
  onActions?: IStepActionsSubComponent
  role: UserRoles
  redirectAfterLogin?: () => void
}

const SignInFacebook = ({ onActions, role, redirectAfterLogin }: IFBSignInProps) => {
  const { setCookie } = useCookies(['account', 'userAccount'])
  const [userData, setUserData] = React.useState<any>()

  React.useEffect(() => {
    setfbAsyncInit()
  }, [])

  React.useEffect(() => {
    if (userData) {
      getMoreDataFromFB()
    }
  }, [userData])

  const getMoreDataFromFB = async () => {
    //TODO GET MORE USER DATA IF NEEDED
    // https://developers.facebook.com/docs/graph-api/overview
    // const fbUserDataResponse = await axios.get(
    //   `https://graph.facebook.com/${userData.userId}?fields=id,name,email,picture&access_token=${userData.token}`
    // )

    // if (fbUserDataResponse.status === 200) {
    //   console.log(fbUserDataResponse.data)
    // }

    if (onActions) {
      onActions.onNextStep()
    }

    if (redirectAfterLogin) {
      redirectAfterLogin()
    }
  }

  const setfbAsyncInit = () => {
    window.fbAsyncInit = (function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.6',
      })
    })()
  }

  const toQueryString = (object: any) => {
    return Object.keys(object)
      .map((key) => `${key}=${encodeURIComponent(object[key])}`)
      .join('&')
  }

  const click = (e: any) => {
    if (e.defaultPrevented) {
      return
    }

    const params = {
      client_id: FACEBOOK_APP_ID,
      redirect_uri: location.host.includes('localhost') ? 'https://watchparty-spa.red5pro.net/' : location.host,
      state: 'facebookdirect',
    }

    if (isMobileScreen()) {
      window.location.href = `//www.facebook.com/dialog/oauth?${toQueryString(params)}`
    } else {
      window.FB.login(function (response: any) {
        if (response.authResponse) {
          window.FB.api('/me', { fields: 'email' }, function (meResponse: any) {
            const account: ThirdPartyAccount = {
              token: response.authResponse.accessToken,
              thirdParty: ThirdParties.FACEBOOK,
              id: meResponse.id,
            }

            const userAccount: ThirdPartyUserAccount = {
              name: meResponse.name,
              role: role,
            }

            setCookie('account', account, { secure: true })
            setCookie('userAccount', userAccount, { secure: true })

            setUserData({ token: response.authResponse.accessToken, userId: meResponse.id })
          })
        }
      })
    }
  }

  return (
    <CustomButton
      fullWidth
      startIcon={<FacebookIcon />}
      size={BUTTONSIZE.MEDIUM}
      buttonType={BUTTONTYPE.FACEBOOK}
      onClick={click}
    >
      Sign In with Facebook
    </CustomButton>
  )
}

export default SignInFacebook
