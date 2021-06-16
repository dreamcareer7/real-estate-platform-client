import { memo } from 'react'

import { useTitle } from 'react-use'

import { WithRouterProps } from 'react-router'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import TabContentSwitch from 'components/TabContentSwitch'

import LoadingContainer from 'components/LoadingContainer'

import ShowingDetailTabs, { ShowingDetailTabsProps } from './ShowingDetailTabs'

import { showingDetailTabs } from '../../constants'
import ShowingDetailTabBookings from './ShowingDetailTabBookings'
import ShowingDetailTabVisitors from '../../components/ShowingDetailTabVisitors'
import ShowingDetailTabSettings from '../../components/ShowingDetailTabSettings'
import ShowingDetailHeader from '../../components/ShowingDetailHeader'
import useGetShowing from './use-get-showing'
import { getShowingBookingPageUrl, getShowingImage } from '../../helpers'

type ShowingDetailProps = WithRouterProps<{
  tab?: ShowingDetailTabsProps['value']
  id: UUID
}>

const defaultAppointments: IShowingAppointment[] = []

function ShowingDetail({ params }: ShowingDetailProps) {
  useTitle('Showing Detail | Rechat')

  const showingId = params.id

  const { showing, isLoading, setShowing } = useGetShowing(showingId)

  const tab = params.tab || showingDetailTabs.Bookings

  const showingBookingUrl = showing ? getShowingBookingPageUrl(showing) : ''

  return (
    <PageLayout position="relative" overflow="hidden" gutter={0}>
      <ShowingDetailHeader
        image={getShowingImage({
          deal: showing?.deal,
          listing: showing?.listing ?? null
        })}
        address={showing?.title || ''}
        listing={showing?.listing || (showing?.deal?.listing as IListing)}
        bookingUrl={showingBookingUrl}
      />
      <PageLayout.Main gutter={4} mt={0}>
        <Box mb={3}>
          <ShowingDetailTabs value={tab} id={showingId} />
        </Box>
        {isLoading || !showing ? (
          <Box height="600px">
            <LoadingContainer
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: 0
              }}
            />
          </Box>
        ) : (
          <TabContentSwitch.Container value={tab}>
            <TabContentSwitch.Item value={showingDetailTabs.Bookings}>
              <ShowingDetailTabBookings
                appointments={showing.appointments ?? defaultAppointments}
                setShowing={setShowing}
              />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Visitors}>
              <ShowingDetailTabVisitors
                showing={showing}
                appointments={showing.appointments ?? defaultAppointments}
              />
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={showingDetailTabs.Settings}>
              <ShowingDetailTabSettings
                showing={showing}
                setShowing={setShowing}
              />
            </TabContentSwitch.Item>
          </TabContentSwitch.Container>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(ShowingDetail)
