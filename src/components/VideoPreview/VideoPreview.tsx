import {
  Box,
  CardContent,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import * as React from 'react'
import { allowMediaStreamSwap } from '../../utils/deviceSelectorUtil'
import useVideoStyles from './VideoPreview.module'
import { Button, LinearProgress } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-mui'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().max(50).required('Name field is required'),
  room: Yup.string().max(50).required('Room field is required'),
  camera: Yup.string().max(50).required('Camera field is required'),
  microphone: Yup.string().max(50).required('Microphone field is required'),
})

const VideoPreview = () => {
  const { classes } = useVideoStyles()
  const [cameraSelected, setCameraSelected] = React.useState<string>('')
  const [microphoneSelected, setMicrophoneSelected] = React.useState<string>('')

  const videoRef = React.useRef(null)

  // TODO Check how to remove this any
  const [cameraOptions, setCameraOptions] = React.useState<
    MediaDeviceInfo[] | any
  >([])
  const [micOptions, setMicOptions] = React.useState<MediaDeviceInfo[]>([])

  React.useEffect(() => {
    getMediaStream()
  }, [])

  React.useEffect(() => {
    if (micOptions.length) {
      setMicrophoneSelected(micOptions[0].deviceId)
    }
  }, [micOptions])

  React.useEffect(() => {
    if (cameraOptions.length) {
      setCameraSelected(cameraOptions[0].deviceId ?? cameraOptions[0].id)
    }
  }, [cameraOptions])

  const getMediaStream = async () => {
    const constraints = {
      audio: true,
      video: {
        width: {
          ideal: 320,
        },
        height: {
          ideal: 240,
        },
      },
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

    const [cameraList, microphoneList] = await allowMediaStreamSwap(
      constraints,
      mediaStream,
    )

    if (videoRef) {
      const video: any = videoRef.current

      if (video && mediaStream) {
        video.srcObject = mediaStream
        video.play()
      }
    }

    setCameraOptions(cameraList)
    setMicOptions(microphoneList)
  }

  const initialValues = {
    name: '',
    room: '',
    camera: cameraSelected ?? '',
    microphone: microphoneSelected ?? '',
  }

  console.log({ cameraOptions, micOptions })

  return (
    <Box>
      <CardContent className={classes.container}>
        <Typography component='h5' variant='h5' textAlign='center' margin={3}>
          Join the Party!
        </Typography>
        <video
          ref={videoRef}
          id='video'
          width='100%'
          height='100%'
          autoPlay
          muted
          playsInline
          loop
          onContextMenu={() => false}
          className={classes.video}
        />
      </CardContent>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false)
            alert(JSON.stringify(values, null, 2))
          }, 500)
        }}
      >
        {(props: any) => {
          const { submitForm, isSubmitting, setFieldValue } = props
          const microHandleChange = (ev: any) => {
            const value = ev?.target?.value
            setFieldValue('microphone', value.deviceId)
            setMicrophoneSelected(value.deviceId)
            // setSelectedMicrophoneIndexFromTrack(audioTrack, mics);
          }
          const cameraHandleChange = (ev: any) => {
            const value = ev?.target?.value
            setFieldValue('camera', value.deviceId ?? value.id)
            setCameraSelected(value.deviceId ?? value.id)
            // setSelectedCameraIndexFromTrack(videoTrack, cameras)
          }
          return (
            // TODO COLAPSE ADVANCE SETTINGS
            <Form>
              <Box
                display='flex'
                width='30%'
                margin='auto'
                className={classes.formContainer}
              >
                <Field
                  component={TextField}
                  name='name'
                  type='text'
                  label='Enter Your Name'
                  className={classes.inputField}
                />
                <Field
                  component={TextField}
                  type='text'
                  label='Room'
                  name='room'
                  className={classes.inputField}
                />
                <Select
                  id='camera'
                  name='camera'
                  onChange={cameraHandleChange}
                  className={classes.inputField}
                  MenuProps={{
                    style: {
                      zIndex: 13000,
                    },
                  }}
                  value={cameraSelected}
                  {...props}
                >
                  {cameraOptions.map(
                    (opt: MediaDeviceInfo | any, key: number) => {
                      return (
                        <MenuItem
                          value={opt.deviceId ?? opt.id}
                          key={key}
                          className={classes.menuItem}
                        >
                          <ListItemText className={classes.item}>{`${
                            opt.label ?? 'camera '
                          }${key}`}</ListItemText>
                        </MenuItem>
                      )
                    },
                  )}
                </Select>
                {console.log({ cameraSelected, microphoneSelected })}
                <Select
                  id='microphone'
                  name='microphone'
                  onChange={microHandleChange}
                  value={microphoneSelected}
                  className={classes.inputField}
                  MenuProps={{
                    style: {
                      zIndex: 13000,
                    },
                  }}
                  {...props}
                >
                  {micOptions.map((opt: MediaDeviceInfo, key: number) => {
                    return (
                      <MenuItem
                        value={opt.deviceId}
                        key={key}
                        className={classes.menuItem}
                      >
                        <ListItemText className={classes.item}>{`${
                          opt.label ?? 'camera '
                        }${key}`}</ListItemText>
                      </MenuItem>
                    )
                  })}
                </Select>
                {isSubmitting && <LinearProgress />}
                <br />
                <Button
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Join!
                </Button>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}

export default VideoPreview
