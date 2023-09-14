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
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import { StatsByConference } from '../../../models/ConferenceStats'
import useStyles from './TabSection.module'
import TabPanel from './TabPanel'
import StatsTable from './StatsTable'
import { Column, SectionValueSelected } from '..'
import {
  getSortedCountryList,
  mapLiveStatsData,
  mapPastEventsStatsData,
  mapSeriesStatsData,
  mapSpecialGuestsStatsData,
} from '../../../utils/statsUtils'
import CountryList from '../MainTotalValues/CountryList'
import { USER_API_CALLS } from '../../../services/api/user-api-calls'
import CustomButton, { BUTTONSIZE, BUTTONTYPE } from '../../Common/CustomButton/CustomButton'
import CreateSection from '../CreateSection/CreateSection'
import { Serie } from '../../../models/Serie'
import { SERIES_API_CALLS } from '../../../services/api/serie-api-calls'

const TABS_SECTION = ['Live Stats', 'Series', 'Past Conferences', 'Special Guests']

const mappingFunctions = (value: number, data: StatsByConference[] | any) => {
  switch (value) {
    case 0:
      return mapLiveStatsData(data)
    case 1:
      return mapSeriesStatsData(data)
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
  statsByConference: StatsByConference[]
  setError: (value: any) => void
  setOpenCreatePage: (value: boolean) => void
  openCreatePage: boolean
  cookies: any
}

const TabsSection = (props: ITabsSectionProps) => {
  const { setError, setOpenCreatePage, openCreatePage, cookies, statsByConference } = props
  const [value, setValue] = React.useState(0)

  const [pageToOpen, setPageToOpen] = React.useState<string>('')

  const [tableHead, setTableHead] = React.useState<Column[]>([])
  const [dataRow, setDataRow] = React.useState<any>([])
  const [buttonLabel, setButtonLabel] = React.useState<string>(getLabelButton(0) ?? '')

  const { classes } = useStyles()

  const [data, setData] = React.useState<any>(statsByConference)
  const [series, setSeries] = React.useState<Serie[]>([])
  const [users, setUsers] = React.useState<any>([])
  const [countries, setCountries] = React.useState<{ country: string; count: number }[]>([])

  React.useEffect(() => {
    const getData = async () => {
      const response = await getSeries()

      if (response) {
        setSeries(response)
      }
    }

    getData()
  }, [])

  React.useEffect(() => {
    if (data) {
      const { head, rows } = mappingFunctions(value, data)

      setTableHead(head)
      setDataRow(rows)
      setCountries(getSortedCountryList(statsByConference))
    }
  }, [data])

  const getSeries = async () => {
    const response = await SERIES_API_CALLS.getSeriesList()

    if (response.status !== 200) {
      setError({
        status: `Warning!`,
        statusText: `${response.statusText}`,
      })
      return
    }

    return response.data.series
  }

  const getData = async (tabValue: number, shouldUpdateValues: boolean) => {
    setButtonLabel(getLabelButton(tabValue) ?? '')

    if (tabValue === 1) {
      if (!series?.length || shouldUpdateValues) {
        const response = await getSeries()
        setSeries(response)
        setData(response)
      } else {
        setData(series)
      }
    } else if (tabValue === 0 || tabValue === 2) {
      setData(statsByConference)
    } else {
      if (!users?.length || shouldUpdateValues) {
        const response = await USER_API_CALLS.getUsers(cookies.account.username, cookies.account.password)
        if (response.status !== 200) {
          setError({
            status: `Warning!`,
            statusText: `${response.statusText}`,
          })
          return
        }
        setUsers(response.data.users)
        setData(response.data.users)
      } else {
        setData(users)
      }
    }
  }

  const handleChange = async (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    await getData(newValue, false)
  }

  const handleOnClick = (value: number) => {
    setOpenCreatePage(true)
    setPageToOpen(SectionValueSelected[value])
  }

  const backToPage = async (shouldUpdateValues: boolean) => {
    setOpenCreatePage(false)
    if (shouldUpdateValues) {
      await getData(value, shouldUpdateValues)
    }
  }

  return (
    <>
      {openCreatePage && pageToOpen && (
        <CreateSection sectionValueSelected={pageToOpen} backToPage={backToPage} series={series} />
      )}

      <Box
        sx={{ width: '100%' }}
        display={openCreatePage ? 'none' : 'flex'}
        flexDirection="column"
        justifyContent="center"
        className={classes.root}
      >
        <Box display="flex" justifyContent="space-between">
          <Box sx={{ width: 'fit-content', margin: '0 2rem' }}>
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
          <CountryList countries={countries} />
          <TabPanel value={value} index={0}>
            <StatsTable tableHead={tableHead} dataRow={dataRow} />
          </TabPanel>
        </Box>
      </Box>
    </>
  )
}

export default TabsSection
