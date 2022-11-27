import * as React from 'react'
import { Link as LinkTo } from 'react-router-dom'
import { Box, Input, Link, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import useStyles from './ShareLink.module'

interface IShareLinkProps {
  joinToken: string
}

const ShareLink = (props: IShareLinkProps) => {
  const { joinToken } = props

  const [textCopied, setTextCopied] = React.useState<boolean>(false)
  const { classes } = useStyles()

  const textLinkRef = React.useRef<HTMLInputElement>(null)

  const linkToCopy = `${location.href}join/${joinToken}`

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
        <Typography className={classes.title}>Your watch party is ready!</Typography>
        <Typography textAlign="center" marginY={1}>
          Now you can invite your friends
        </Typography>
        <Box display="flex" justifyContent="center" className={classes.buttonsContainer}>
          <CustomButton startIcon={<FacebookIcon />} size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.FACEBOOK}>
            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${linkToCopy}&display=page`} target="_blank">
              Share on Facebook
            </Link>
          </CustomButton>

          <CustomButton size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.PRIMARY} onClick={copyToClipboard}>
            Copy link
          </CustomButton>
        </Box>
        <CustomButton fullWidth size={BUTTONSIZE.MEDIUM} buttonType={BUTTONTYPE.SECONDARY}>
          <LinkTo className={classes.linkToJoin} to={`/join/${joinToken}?s_id=2`}>
            Continue to Watch Party
          </LinkTo>
        </CustomButton>

        <Box display={textCopied ? 'block' : 'none'} marginY={2}>
          <Typography className={classes.title}>Link copied!</Typography>
          <Input ref={textLinkRef} value={linkToCopy} defaultValue={linkToCopy} sx={{ width: '100%' }} />
        </Box>
      </Box>
    </Box>
  )
}

export default ShareLink
