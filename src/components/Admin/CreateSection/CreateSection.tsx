import { SectionValueSelected } from '..'
import { Serie } from '../../../models/Serie'
import CreateGuestAccount from '../../Account/GuestAccount/CreateGuestAccount'
import CreateEvent from './CreateEvent'
import CreateSerie from './CreateSerie'

interface ICreateSectionProps {
  sectionValueSelected: string
  backToPage: (value: boolean) => Promise<void>
  series: Serie[]
}

const CreateSection = (props: ICreateSectionProps) => {
  const { sectionValueSelected, backToPage, series } = props

  if (sectionValueSelected === SectionValueSelected[0]) {
    return <CreateEvent backToPage={backToPage} series={series} />
  }

  if (sectionValueSelected === SectionValueSelected[1]) {
    return <CreateSerie backToPage={backToPage} />
  }

  if (sectionValueSelected === SectionValueSelected[3]) {
    return <CreateGuestAccount backToPage={backToPage} />
  }

  return null
}

export default CreateSection
