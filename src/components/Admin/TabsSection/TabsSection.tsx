import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import { StatsByConference } from '../../../models/ConferenceStats'
import useStyles from './TabSection.module'
import TabPanel from './TabPanel'
import StatsTable from './StatsTable'
import { Column, SectionValueSelected } from '..'
import { mapLiveStatsData, mapPastEventsStatsData, mapSpecialGuestsStatsData } from '../../../utils/statsUtils'
import CountryList from '../MainTotalValues/CountryList'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import useCookies from '../../../hooks/useCookies'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import CreateSection from '../CreateSection/CreateSection'

const TABS_SECTION = ['Live Stats', 'Series', 'Past Conferences', 'Special Guests']

const mappingFunctions = (value: number, data: StatsByConference[] | any) => {
  switch (value) {
    case 0:
      return mapLiveStatsData(data)
    case 1:
      return { head: [], rows: [] }
    case 2:
      return mapPastEventsStatsData(data)
    case 3:
      return mapSpecialGuestsStatsData(data)

    default:
      return mapLiveStatsData(data)
  }
}

const getLabelButton = (value: number) => {
  return {
    0: 'Create an Event',
    1: 'Create a Serie ',
    3: 'Invite Special Guest',
  }[value]
}

interface ITabsSectionProps {
  statsByConferece: StatsByConference[]
  countries: { country: string; count: number }[]
  setError: (value: any) => void
  setLoading: (value: boolean) => void
  setOpenCreatePage: (value: boolean) => void
  setReady: (value: boolean) => void
  openCreatePage: boolean
}

const TabsSection = (props: ITabsSectionProps) => {
  const { statsByConferece, countries, setError, setLoading, setOpenCreatePage, openCreatePage, setReady } = props
  const [value, setValue] = React.useState(0)

  const [pageToOpen, setPageToOpen] = React.useState<string>('')

  const [tableHead, setTableHead] = React.useState<Column[]>([])
  const [dataRow, setDataRow] = React.useState<any>([])
  const [buttonLabel, setButtonLabel] = React.useState<string>('')

  const { classes } = useStyles()
  const { getCookies } = useCookies(['account'])

  React.useEffect(() => {
    if (statsByConferece) {
      getData()
      setButtonLabel(getLabelButton(value) ?? '')
    }
  }, [statsByConferece, value])

  const getData = async () => {
    let users

    if (value === 3) {
      setLoading(true)

      const { account } = getCookies()

      const response = await USER_API_CALLS.getUsers(account.username, account.password)

      setLoading(false)
      if (response.status !== 200) {
        setError({
          status: `Warning!`,
          statusText: `${response.statusText}`,
        })
        return
      }

      users = response.data.users
    }

    const data = users ? users : statsByConferece

    const { head, rows } = mappingFunctions(value, data)

    setTableHead(head)
    setDataRow(rows)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleOnClick = (value: number) => {
    setOpenCreatePage(true)

    setPageToOpen(SectionValueSelected[value])
  }

  const backToPage = async (shouldUpdateValues: boolean) => {
    setOpenCreatePage(false)
    if (shouldUpdateValues) {
      if (value === 3) {
        await getData()
      } else if (value === 1) {
        console.log('get series')
      } else {
        setReady(true)
      }
    }
  }

  return (
    <>
      {openCreatePage && pageToOpen && <CreateSection sectionValueSelected={pageToOpen} backToPage={backToPage} />}

      <Box
        sx={{ width: '100%' }}
        display={openCreatePage ? 'none' : 'flex'}
        flexDirection="column"
        justifyContent="center"
        className={classes.root}
      >
        <Box display="flex" justifyContent="space-between">
          <Box sx={{ width: 'fit-content', margin: '15px 2rem' }}>
            <Tabs className={classes.tabs} value={value} onChange={handleChange}>
              {TABS_SECTION.map((item: string, index) => (
                <Tab
                  label={item}
                  id={item}
                  key={item}
                  className={value === index ? classes.currTab : classes.nonCurrTab}
                  sx={{
                    padding: '10px 15px',
                    margin: '5px',
                    minHeight: 'fit-content',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Tabs>
          </Box>
          {buttonLabel && (
            <Box marginRight={2}>
              <CustomButton
                size={BUTTONSIZE.MEDIUM}
                type="button"
                buttonType={BUTTONTYPE.TERTIARY}
                onClick={() => handleOnClick(value)}
              >
                {buttonLabel}
              </CustomButton>
            </Box>
          )}
        </Box>
        <Box display="flex">
          <>
            <CountryList countries={countries} />
            <TabPanel value={value} index={0}>
              <StatsTable tableHead={tableHead} dataRow={dataRow} />
            </TabPanel>
          </>
        </Box>
      </Box>
    </>
  )
}

export default TabsSection
