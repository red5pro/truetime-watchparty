import PubNub from 'pubnub'
import * as React from 'react'
import { PubNubProvider } from 'pubnub-react'
import { Chat, UserEntity } from '@pubnub/react-chat-components'
import { PUBLISH_API_KEY, SUBSCRIBE_API_KEY } from '../../settings/variables'
import JoinContext from '../JoinContext/JoinContext'
import WatchContext from '../WatchContext/WatchContext'

interface IChatBoxProps {
  children: any
}

const MainStageWithChatBox = ({ children }: IChatBoxProps) => {
  const [pubnub, setpubnub] = React.useState<any>()
  const [ready, setReady] = React.useState<boolean>(false)
  const [channelName, setChannelName] = React.useState<string>('')
  const [chatUsers, setChatUsers] = React.useState<UserEntity[]>([])

  const joinContext = React.useContext(JoinContext.Context)
  const { data } = React.useContext(WatchContext.Context)

  React.useEffect(() => {
    if (PUBLISH_API_KEY && SUBSCRIBE_API_KEY && joinContext.nickname && joinContext.joinToken) {
      const pubNub = new PubNub({
        publishKey: PUBLISH_API_KEY,
        subscribeKey: SUBSCRIBE_API_KEY,
        uuid: joinContext.nickname,
      })
      setpubnub(pubNub)
      setChannelName(joinContext.joinToken)
      setReady(true)
    }
  }, [joinContext.joinToken, joinContext.nickname])

  // CHECK if this is needed
  React.useEffect(() => {
    if (data.list.length > 0) {
      const users: UserEntity[] = []

      data.list.map((user: any) => {
        users.push({
          name: user.displayName,
          email: null,
          id: user.displayName, //user.participantId,
          eTag: '',
          updated: new Date().toString(),
        })
      })
      setChatUsers(users)
    }
  }, [data.list])

  return (
    <>
      {ready && (
        <PubNubProvider client={pubnub}>
          <Chat
            {...{
              currentChannel: channelName,
              channels: [channelName],
              theme: 'dark',
              users: chatUsers,
            }}
          >
            {children}
          </Chat>
        </PubNubProvider>
      )}
    </>
  )
}

export default MainStageWithChatBox
