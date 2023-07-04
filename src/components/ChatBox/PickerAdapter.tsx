import Picker, { IEmojiData } from 'emoji-picker-react'
import { EmojiPickerElementProps } from '@pubnub/react-chat-components'

const PickerAdapter = (props: EmojiPickerElementProps) => {
  const handleEmoji = (event: React.MouseEvent, emoji: IEmojiData) => {
    if (props.onEmojiSelect) props.onEmojiSelect({ native: emoji.emoji })
  }

  return <Picker onEmojiClick={handleEmoji} />
}

export default PickerAdapter
