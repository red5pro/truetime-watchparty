import * as React from 'react'
import { FACEBOOK_APP_ID } from '../../../settings/variables'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import FacebookIcon from '@mui/icons-material/Facebook'
import { isMobileScreen, IStepActionsSubComponent, ThirdParties, UserRoles } from '../../../utils/commonUtils'

import { ThirdPartyAccount, ThirdPartyUserAccount } from '../../../models/UserAccount'
import useCookies from '../../../hooks/useCookies'
import axios, { AxiosResponse } from 'axios'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import { formControlUnstyledClasses } from '@mui/base'
import { ConstructionOutlined } from '@mui/icons-material'

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

  // React.useEffect(() => {
  //   if (userData) {
  //     getMoreDataFromFB()
  //   }
  // }, [userData])

  React.useEffect(() => {
    if (userData) {
      signInWatchparty()
    }
  }, [userData])

  const signInWatchparty = async () => {
    USER_API_CALLS.signInFacebookUser(userData.account.token)
      .then((signInResponse: AxiosResponse) => {
        debugger
        if (signInResponse.status === 200) {
          setCookie('account', userData.account, { secure: true, expires: userData.expires })
          setCookie('userAccount', userData.userAccount, { secure: true, expires: userData.expires })
        }
      })
      .catch((er: any) => console.log('error here!!!', er))
  }

  const getMoreDataFromFB = async () => {
    //TODO GET MORE USER DATA IF NEEDED

    // https://developers.facebook.com/docs/graph-api/overview
    const fbUserDataResponse = await axios.get(
      `https://graph.facebook.com/${userData.userId}?metadata=1&access_token=${userData.token}`
    )

    if (fbUserDataResponse.status === 200) {
      console.log(fbUserDataResponse.data)
    }

    // https://developers.facebook.com/docs/graph-api/overview

    let fields = fbUserDataResponse.data.metadata.fields.map((item: any) => item.name).join(',')

    try {
      let fbUserDataResponse2 = await axios.get(
        `https://graph.facebook.com/${userData.userId}?fields=${fields}&access_token=${userData.token}`
      )

      if (fbUserDataResponse2.status === 200) {
        console.log(fbUserDataResponse.data)
      } else {
        fields = fbUserDataResponse.data.metadata.fields
          .filter((item: any) => {
            if (item.name !== 'public_profile' && item.name !== 'profile_pic' && !item.name.includes('business')) {
              return item.name
            }
          })
          .map((item2: any) => item2.name)
          .join(',')

        console.log('updated fields', { fields })

        fbUserDataResponse2 = await axios.get(
          `https://graph.facebook.com/${userData.userId}?fields=${fields}&access_token=${userData.token}`
        )

        console.log('updated data', fbUserDataResponse.data)
      }
    } catch (er: any) {
      fields = fbUserDataResponse.data.metadata.fields
        .filter((item: any) => {
          if (item.name !== 'public_profile' && item.name !== 'profile_pic' && !item.name.includes('business')) {
            return item.name
          }
        })
        .map((item2: any) => item2.name)
        .join(',')

      console.log('updated fields', { fields })

      const fbUserDataResponse2 = await axios.get(
        `https://graph.facebook.com/${userData.userId}?fields=${fields}&access_token=${userData.token}`
      )

      console.log('updated data', fbUserDataResponse2.data)
    }

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
      window.FB.getLoginStatus(function (response: any) {
        if (response.status === 'connected') {
          console.log('getLoginStatus = ::connected:: -> response: ', response)
        } else if (response.status === 'not_authorized') {
          login()
        } else {
          login()
        }
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

    login()
  }

  const login = () => {
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
          window.FB.api(
            '/me',
            'GET',
            {
              fields:
                'id,name,about,age_range,education,birthday,email,favorite_athletes,favorite_teams,first_name,gender,hometown,inspirational_people,install_type,meeting_for,location,last_name,languages,is_guest_user,link,friends',
            },
            function (meResponse: any) {
              const account: ThirdPartyAccount = {
                token: response.authResponse.accessToken,
                thirdParty: ThirdParties.FACEBOOK,
                id: meResponse.id,
              }

              const userAccount: ThirdPartyUserAccount = {
                name: meResponse.name,
                role: role,
              }

              // our cookies will expire when the fb cookie expires
              const date = new Date()
              date.setSeconds(date.getSeconds() + response.authResponse.expiresIn)

              setUserData({ expires: date.toUTCString(), account, userAccount })
            }
          )
        } else {
          console.log('login failed', response)
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
