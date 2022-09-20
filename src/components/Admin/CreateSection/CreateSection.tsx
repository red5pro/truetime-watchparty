import { SectionValueSelected } from '..'
import CreateGuestAccount from '../../Account/GuestAccount/CreateGuestAccount'
import CreateSerie from './CreateSerie'

interface ICreateSectionProps {
  sectionValueSelected: string
  backToPage: (value: boolean) => Promise<void>
}

const CreateSection = (props: ICreateSectionProps) => {
  const { sectionValueSelected, backToPage } = props

  if (sectionValueSelected === SectionValueSelected[1]) {
    return <CreateSerie backToPage={backToPage} />
  } else if (sectionValueSelected === SectionValueSelected[3]) {
    return <CreateGuestAccount backToPage={backToPage} />
  }

  return null
}

export default CreateSection
