import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import Signin from '../../components/Account/Signin/Signin'
import Loading from '../../components/Common/Loading/Loading'
import { useLoadScript } from '../../hooks/useLoadScript'
import useQueryParams from '../../hooks/useQueryParams'

const SignInPage = () => {
  const facebookLoaded = useLoadScript()

  const navigate = useNavigate()
  const query = useQueryParams()

  const getLink = (link: string | null) => {
    return !link || link === 'home' ? `/` : `/${link}`
  }

  const redirectAfterLogin = () => {
    navigate(getLink(query.get('r_id')))
  }

  if (!facebookLoaded) {
    return <Loading />
  }

  return <Signin redirectAfterLogin={redirectAfterLogin} facebookLoaded={facebookLoaded} />
}

export default SignInPage
