import * as React from 'react'
import { FACEBOOK_APP_ID } from '../../../settings/variables'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import FacebookIcon from '@mui/icons-material/Facebook'
import { isMobileScreen, IStepActionsSubComponent, ThirdParties, UserRoles } from '../../../utils/commonUtils'

import { ThirdPartyAccount, ThirdPartyUserAccount } from '../../../models/UserAccount'
import useCookies from '../../../hooks/useCookies'

interface IFBSignInProps {
  onActions?: IStepActionsSubComponent
  role: UserRoles
  redirectAfterLogin?: () => void
}

const SignInFacebook = ({ onActions, role, redirectAfterLogin }: IFBSignInProps) => {
  const { setCookie } = useCookies(['account', 'userAccount'])

  React.useEffect(() => {
    setfbAsyncInit()
  }, [])

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
      redirect_uri: 'https://watchparty-spa.red5pro.net/', // location.href,
      state: 'facebookdirect',
    }

    if (isMobileScreen()) {
      window.location.href = `//www.facebook.com/dialog/oauth?${toQueryString(params)}`
    } else {
      window.FB.login(function (response: any) {
        if (response.authResponse) {
          window.FB.api('/me', function (meResponse: any) {
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

            //TODO MAKE API CALL
            //TODO GET MORE USER DATA IF NEEDED
            // "https://graph.facebook.com/USER-ID?fields=id,name,email,picture&access_token=ACCESS-TOKEN"
            // https://developers.facebook.com/docs/graph-api/overview

            if (onActions) {
              onActions.onNextStep()
            }

            if (redirectAfterLogin) {
              redirectAfterLogin()
            }
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
