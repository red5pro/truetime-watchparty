import Picker, { IEmojiData } from 'emoji-picker-react'
import { EmojiPickerElementProps } from '@pubnub/react-chat-components'

const PickerAdapter = (props: EmojiPickerElementProps) => {
  const handleEmoji = (event: React.MouseEvent, emoji: IEmojiData) => {
    if (props.onSelect) props.onSelect({ native: emoji.emoji })
  }

  return <Picker onEmojiClick={handleEmoji} />
}

export default PickerAdapter
