import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import Signin from '../../components/Account/Signin/Signin'
import { useLoadScript } from '../../hooks/useLoadScript'
import useQueryParams from '../../hooks/useQueryParams'

const SignInPage = () => {
  let facebookLoaded = false

  const navigate = useNavigate()
  const query = useQueryParams()

  const getLink = (link: string | null) => {
    return !link || link === 'home' ? `/` : `/${link}`
  }

  const isAdminLoggingIn = getLink(query.get('r_id')).includes('admin')

  if (!isAdminLoggingIn) {
    facebookLoaded = useLoadScript()
  }

  const redirectAfterLogin = () => {
    navigate(getLink(query.get('r_id')))
  }

  // NEED this to test in the server
  console.log('Facebook Script loaded - facebookLoaded: ', facebookLoaded)
  console.log('Facebook is ready - window.FB: ', window.FB)

  return (
    <Signin
      redirectAfterLogin={redirectAfterLogin}
      facebookLoaded={facebookLoaded}
      isAdminLoggingIn={isAdminLoggingIn}
    />
  )
}

export default SignInPage
