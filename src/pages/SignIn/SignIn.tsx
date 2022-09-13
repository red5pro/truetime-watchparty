import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import Signin from '../../components/Account/Signin/Signin'
import Loading from '../../components/Common/Loading/Loading'
import { useLoadScript } from '../../hooks/useLoadScript'

const SignInPage = () => {
  const facebookLoaded = useLoadScript()

  const navigate = useNavigate()

  const redirectAfterLogin = () => {
    navigate('/')
  }

  if (!facebookLoaded) {
    return <Loading />
  }

  return <Signin redirectAfterLogin={redirectAfterLogin} facebookLoaded={facebookLoaded} />
}

export default SignInPage
