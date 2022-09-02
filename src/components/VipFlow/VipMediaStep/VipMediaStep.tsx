import { IStepActionsSubComponent } from '../../../utils/commonUtils'
import JoinSectionAVSetup from '../../JoinSections/JoinSectionAVSetup'

interface VipMediaStepProps {
  onActions: IStepActionsSubComponent
}

const VipMediaStep = (props: VipMediaStepProps) => {
  const { onActions } = props

  return <JoinSectionAVSetup onJoin={onActions.onNextStep} shouldDisplayBackButton={false} />
}

export default VipMediaStep
