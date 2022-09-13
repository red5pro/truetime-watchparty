import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import Signin from '../../components/Account/Signin/Signin'
import Loading from '../../components/Common/Loading/Loading'
import { useLoadScript } from '../../hooks/useLoadScript'
import useQueryParams from '../../hooks/useQueryParams'
import { IStepActionsSubComponent } from '../../utils/commonUtils'

const SignInPage = () => {
  const facebookLoaded = useLoadScript()

  const navigate = useNavigate()
  const query = useQueryParams()

  const getLink = (link: string | null) => {
    return link === 'home' ? `/` : `/${link}`
  }

  const redirectAfterLogin = () => {
    navigate('/')
  }

  if (!facebookLoaded) {
    return <Loading />
  }

  const onActions = query.get('r_id')
    ? ({
        onNextStep: () => {
          navigate(getLink(query.get('r_id')))
        },
        onBackStep: () => {
          navigate(getLink(query.get('r_id')))
        },
      } as IStepActionsSubComponent)
    : undefined

  return <Signin onActions={onActions} redirectAfterLogin={redirectAfterLogin} facebookLoaded={facebookLoaded} />
}

export default SignInPage
