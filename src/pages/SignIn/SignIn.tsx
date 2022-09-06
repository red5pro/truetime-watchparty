import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Signin from '../../components/Account/Signin/Signin'
import useQueryParams from '../../hooks/useQueryParams'
import { IStepActionsSubComponent } from '../../utils/commonUtils'

const SignInPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const query = useQueryParams()
  const navigate = useNavigate()

  const getLink = (link: string | null) => {
    return link === 'home' ? `/` : `/${link}`
  }

  const redirectAfterLogin = () => {
    navigate('/')
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

  return <Signin onActions={onActions} redirectAfterLogin={redirectAfterLogin} />
}

export default SignInPage
