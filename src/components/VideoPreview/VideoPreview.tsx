import { Box, CardContent, ListItemText, MenuItem, Select, Typography } from '@mui/material'
import * as React from 'react'
import { allowMediaStreamSwap } from '../../utils/deviceSelectorUtil'
import useVideoStyles from './VideoPreview.module'
import { Button, LinearProgress } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-mui'
import * as Yup from 'yup'
import RoomContext from '../RoomContext/RoomContext'

const validationSchema = Yup.object().shape({
  name: Yup.string().max(50).required('Name field is required'),
  room: Yup.string().max(50).required('Room field is required'),
  camera: Yup.string().max(50).required('Camera field is required'),
  microphone: Yup.string().max(50).required('Microphone field is required'),
})

export interface IRoomFormValues {
  name: string
  room: string
  camera: string
  microphone: string
}

interface IVideoPreviewProps {
  room?: string
  onJoinRoom: (values: IRoomFormValues) => void
}

const VideoPreview = (props: IVideoPreviewProps) => {
  const { room, onJoinRoom } = props
  const { classes } = useVideoStyles()
  const [cameraSelected, setCameraSelected] = React.useState<string>('')
  const [microphoneSelected, setMicrophoneSelected] = React.useState<string>('')

  const videoRef = React.useRef(null)

  // TODO Check how to remove this any
  const [cameraOptions, setCameraOptions] = React.useState<MediaDeviceInfo[] | any>([])
  const [micOptions, setMicOptions] = React.useState<MediaDeviceInfo[]>([])
  const roomContext = React.useContext(RoomContext.Context)

  React.useEffect(() => {
    if (roomContext && roomContext.mediaStream) {
      setMediaOptions()
    }
  }, [roomContext?.mediaStream])

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

  const setMediaOptions = async () => {
    const [cameraList, microphoneList] = await allowMediaStreamSwap(roomContext.constraints, roomContext.mediaStream)

    if (videoRef) {
      const video: any = videoRef.current

      if (video && roomContext.mediaStream) {
        video.srcObject = roomContext.mediaStream
        await video.play()
      }
    }

    setCameraOptions(cameraList)
    setMicOptions(microphoneList)
  }

  const initialValues = {
    name: '',
    room: room ?? '',
    camera: cameraSelected ?? '',
    microphone: microphoneSelected ?? '',
  }

  return (
    <Box>
      <CardContent className={classes.container}>
        <Typography component="h5" variant="h5" textAlign="center" margin={3}>
          Join the Party!
        </Typography>
        <video
          ref={videoRef}
          width="100%"
          height="100%"
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
        onSubmit={async (values) => {
          await onJoinRoom(values)
        }}
        enableReinitialize
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
              <Box display="flex" width="30%" margin="auto" className={classes.formContainer}>
                <Field
                  component={TextField}
                  name="name"
                  type="text"
                  label="Enter Your Name"
                  className={classes.inputField}
                />
                <Field component={TextField} type="text" label="Room" name="room" className={classes.inputField} />
                <Select
                  id="camera"
                  name="camera"
                  onChange={cameraHandleChange}
                  className={classes.inputField}
                  MenuProps={{
                    style: {
                      zIndex: 13000,
                    },
                  }}
                  value={cameraSelected}
                >
                  {cameraOptions.map((opt: MediaDeviceInfo | any, key: number) => {
                    return (
                      <MenuItem value={opt.deviceId ?? opt.id} key={key} className={classes.menuItem}>
                        <ListItemText className={classes.item}>{`${opt.label ?? 'camera '}${key}`}</ListItemText>
                      </MenuItem>
                    )
                  })}
                </Select>
                <Select
                  id="microphone"
                  name="microphone"
                  onChange={microHandleChange}
                  value={microphoneSelected}
                  className={classes.inputField}
                  MenuProps={{
                    style: {
                      zIndex: 13000,
                    },
                  }}
                >
                  {micOptions.map((opt: MediaDeviceInfo, key: number) => {
                    return (
                      <MenuItem value={opt.deviceId} key={key} className={classes.menuItem}>
                        <ListItemText className={classes.item}>{`${opt.label ?? 'camera '}${key}`}</ListItemText>
                      </MenuItem>
                    )
                  })}
                </Select>
                {isSubmitting && <LinearProgress />}
                <br />
                <Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>
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
