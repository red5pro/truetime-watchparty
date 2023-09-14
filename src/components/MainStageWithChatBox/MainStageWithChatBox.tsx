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
              theme: 'light',
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
