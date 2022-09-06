import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import Signin from '../../components/Account/Signin/Signin'
import { loadFBScriptAsyncronously } from '../../utils/facebookScript'

const SignInPage = () => {
  const [facebookLoaded, setFacebookLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      setFacebookLoaded(true)
      return
    }

    loadFBScriptAsyncronously()
    document.getElementById('facebook-jssdk')?.addEventListener('load', () => setFacebookLoaded(true))
  }, [])

  const navigate = useNavigate()
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

  return <Signin onActions={onActions} redirectAfterLogin={redirectAfterLogin} facebookLoaded={facebookLoaded} />
}

export default SignInPage
