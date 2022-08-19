import * as React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import HostAPartySteps from '../../components/HostAPartyFlow/HostAPartySteps'

import { RECAPTCHA_SITE_KEY } from '../../settings/variables'

const Home = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      scriptProps={{
        defer: true,
        appendTo: 'head',
      }}
    >
      <HostAPartySteps />
    </GoogleReCaptchaProvider>
  )
}

export default Home
