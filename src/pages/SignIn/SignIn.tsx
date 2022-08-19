import { useLocation } from 'react-router-dom'
import Signin from '../../components/Account/Signin/Signin'
import { parseQueryParamToObject } from '../../utils/commonUtils'

const SignInPage = () => {
  const location = useLocation()
  const search = location.search
  const params = search ? (parseQueryParamToObject(search) as any) : {}

  return <Signin emailSignin={params.spg ?? false} />
}

export default SignInPage
