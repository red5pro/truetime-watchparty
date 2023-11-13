/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import * as React from 'react'
import { Link as LinkTo } from 'react-router-dom'
import { Box, Input, Link, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './ShareLink.module'
import { isWatchParty } from '../../../settings/variables'

interface IShareLinkProps {
  joinToken: string
}

const ShareLink = (props: IShareLinkProps) => {
  const { joinToken } = props

  const [textCopied, setTextCopied] = React.useState<boolean>(false)
  const { classes } = useStyles()

  const textLinkRef = React.useRef<HTMLInputElement>(null)

  const getCopyLink = () => {
    const parts = location.href.split('?')
    if (parts.length > 1) {
      return [`${parts[0]}join/${joinToken}`, `${parts[1]}`].join('?')
    }
    return `${location.href}/join/${joinToken}`
  }
  const linkToCopy = getCopyLink()

  const copyToClipboard = () => {
    textLinkRef.current?.focus()
    textLinkRef.current?.select

    if (!navigator.clipboard) {
      document.execCommand('copy', true, linkToCopy)
    } else {
      navigator.clipboard.writeText(linkToCopy)
    }

    setTextCopied(true)
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className={classes.root}>
      <Box display="flex" flexDirection="column" className={classes.container}>
        <Typography className={classes.title}>{`Your ${
          isWatchParty ? 'Watch Party' : 'Webinar'
        } is ready!`}</Typography>
        <Typography textAlign="center" marginY={1}>
          Now you can invite your friends
        </Typography>
        <Box display="flex" justifyContent="center" className={classes.buttonsContainer}>
          {/* TODO: ON WEBINAR MODE: Should we share this link on Facebook or the Mixer? */}
          <CustomButton startIcon={<FacebookIcon />} size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.FACEBOOK}>
            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${linkToCopy}&display=page`} target="_blank">
              Share on Facebook
            </Link>
          </CustomButton>

          <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.PRIMARY} onClick={copyToClipboard}>
            Copy link
          </CustomButton>
        </Box>

        <LinkTo className={classes.linkToJoin} to={`/join/${joinToken}?s_id=2`}>
          <CustomButton fullWidth size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
            {`Continue to ${isWatchParty ? 'Watch Party' : 'Webinar'}`}
          </CustomButton>
        </LinkTo>

        <Box display={textCopied ? 'block' : 'none'} marginY={2}>
          <Typography className={classes.title}>Link copied!</Typography>
          <Input ref={textLinkRef} value={linkToCopy} defaultValue={linkToCopy} sx={{ width: '100%' }} />
        </Box>
      </Box>
    </Box>
  )
}

export default ShareLink
