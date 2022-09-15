import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { StatsByConference } from '../../../models/ConferenceStats'
import useStyles from './TabSection.module'
import TabPanel from './TabPanel'
import StatsTable from './StatsTable'
import { Column } from '..'
import { mapLiveStatsData, mapPastEventsStatsData } from '../../../utils/statsUtils'
import CountryList from '../MainTotalValues/CountryList'

const TABS_SECTION = ['Live Stats', 'Series', 'Past Conferences', 'Special Guests']

interface ITabsSectionProps {
  statsByConferece: StatsByConference[]
  countries: { country: string; count: number }[]
}

const mappingFunctions = (value: number, data: StatsByConference[]) => {
  switch (value) {
    case 0:
      return mapLiveStatsData(data)
    case 1:
      return { head: [], rows: [] }
    case 2:
      return mapPastEventsStatsData(data)
    case 3:
      return { head: [], rows: [] }

    default:
      return mapLiveStatsData(data)
  }
}

const TabsSection = ({ statsByConferece, countries }: ITabsSectionProps) => {
  const [value, setValue] = React.useState(0)

  const [tableHead, setTableHead] = React.useState<Column[]>([])
  const [dataRow, setDataRow] = React.useState<any>([])

  const { classes } = useStyles()

  React.useEffect(() => {
    if (statsByConferece) {
      const { head, rows } = mappingFunctions(value, statsByConferece)

      setTableHead(head)
      setDataRow(rows)
    }
  }, [statsByConferece, value])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }} display="flex" flexDirection="column" justifyContent="center" className={classes.root}>
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
      <Box display="flex">
        <>
          <CountryList countries={countries} />
          <TabPanel value={value} index={0}>
            <StatsTable tableHead={tableHead} dataRow={dataRow} />
          </TabPanel>
        </>
      </Box>
    </Box>
  )
}

export default TabsSection
