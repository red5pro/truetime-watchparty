import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Signin from '../../components/Account/Signin/Signin'
import useQueryParams from '../../hooks/useQueryParams'
import { IStepActionsSubComponent, parseQueryParamToObject } from '../../utils/commonUtils'

const SignInPage = () => {
  const location = useLocation()
  const search = location.search
  const params = search ? (parseQueryParamToObject(search) as any) : {}
  const query = useQueryParams()
  const navigate = useNavigate()

  const getLink = (link: string | null) => {
    return link === 'home' ? `/` : `/${link}`
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

  return <Signin onActions={onActions} emailSignin={params.spg ?? false} />
}

export default SignInPage
