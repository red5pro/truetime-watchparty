import * as React from 'react'
import { FACEBOOK_APP_ID } from '../../../settings/variables'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import FacebookIcon from '@mui/icons-material/Facebook'
import { isMobileScreen, IStepActionsSubComponent, ThirdParties, UserRoles } from '../../../utils/commonUtils'

import { ThirdPartyAccount, ThirdPartyUserAccount } from '../../../models/UserAccount'
import useCookies from '../../../hooks/useCookies'
import axios, { AxiosResponse } from 'axios'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import SimpleAlertDialog from '../../Modal/SimpleAlertDialog'

interface IFBSignInProps {
  onActions?: IStepActionsSubComponent
  role: UserRoles
  redirectAfterLogin?: () => void
}

const SignInFacebook = ({ onActions, role, redirectAfterLogin }: IFBSignInProps) => {
  const { setCookie } = useCookies(['account', 'userAccount'])
  const [userData, setUserData] = React.useState<any>()
  const [error, setError] = React.useState<boolean>(false)

  React.useEffect(() => {
    window.FB.getLoginStatus(checkLoginStatus)
  }, [])

  React.useEffect(() => {
    if (userData) {
      signInWatchparty()
    }
  }, [userData])

  // React.useEffect(() => {
  //   if (userData) {
  //     getMoreDataFromFB()
  //   }
  // }, [userData])

  const signInWatchparty = async () => {
    USER_API_CALLS.signInFacebookUser(userData.account.token)
      .then((signInResponse: AxiosResponse) => {
        if (signInResponse.status === 200) {
          setCookie('account', userData.account, { secure: true, expires: userData.expires })
          setCookie('userAccount', userData.userAccount, { secure: true, expires: userData.expires })

          if (onActions) {
            onActions.onNextStep()
          }
        } else {
          console.log('error signInWatchparty!!!', signInResponse)
          setError(true)
        }
      })
      .catch((er: any) => {
        console.log('error signInWatchparty!!!', er)
        setError(true)
      })
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

  const checkLoginStatus = async (response: any) => {
    if (response && response.status == 'connected') {
      USER_API_CALLS.signInFacebookUser(response.authResponse.accessToken)
        .then((signInResponse: AxiosResponse) => {
          if (signInResponse.status === 200) {
            setCookie('account', userData.account, { secure: true, expires: userData.expires })
            setCookie('userAccount', userData.userAccount, { secure: true, expires: userData.expires })
            if (onActions) {
              onActions.onNextStep()
            }
          } else {
            console.log('error signInWatchparty!!!', signInResponse)
            setError(true)
          }
        })
        .catch((er: any) => {
          console.log('error signInWatchparty!!!', er)
          setError(true)
        })
    }
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
      window.FB.login(
        function (response: any) {
          if (response.authResponse) {
            window.FB.api('/me', 'GET', function (meResponse: any) {
              const account: ThirdPartyAccount = {
                token: response.authResponse.accessToken,
                auth: ThirdParties.FACEBOOK,
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
            })
          } else {
            console.log('login failed', response)
            setError(true)
          }
        },
        { scope: 'email' }
      )
    }
  }

  return (
    <>
      <CustomButton
        fullWidth
        startIcon={<FacebookIcon />}
        size={BUTTONSIZE.MEDIUM}
        buttonType={BUTTONTYPE.FACEBOOK}
        onClick={click}
        disabled={error}
      >
        Sign In with Facebook
      </CustomButton>
      {error && (
        <SimpleAlertDialog
          title="Something went wrong"
          message={`There was an error trying to login to your Facebook account, please try again.`}
          confirmLabel="Ok"
          onConfirm={() => {
            window.FB.logout(function () {
              setError(false)
            })
          }}
        />
      )}
    </>
  )
}

export default SignInFacebook
