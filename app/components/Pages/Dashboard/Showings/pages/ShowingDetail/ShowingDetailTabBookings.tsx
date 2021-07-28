import { Dispatch, SetStateAction } from 'react'

import { Location } from 'history'

import ShowingDetailEmptyStateDescription from '../../components/ShowingDetailTabVisitors/ShowingDetailEmptyStateDescription'
import ShowingFilteredBookingList from '../../components/ShowingFilteredBookingList'
import { AppointmentFilter } from '../../types'

import useShowingUpdateAppointmentStatus from './use-showing-update-appointment-status'

const generateAppointmentFilterLink = (
  filter: AppointmentFilter,
  location: Location
) => `${location.pathname}?filter=${filter}`

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment<'showing'>[]
  setShowing: Dispatch<SetStateAction<IShowing<'showing'>>>
  showingBookingUrl?: string
}

function ShowingDetailTabBookings({
  appointments,
  setShowing,
  showingBookingUrl
}: ShowingDetailTabBookingsProps) {
  const updateShowingAppointmentStatus =
    useShowingUpdateAppointmentStatus(setShowing)

  return (
    <ShowingFilteredBookingList
      appointments={appointments}
      onApprovalAction={updateShowingAppointmentStatus}
      generateLink={generateAppointmentFilterLink}
      emptyButtonLabel="Open Booking Page"
      emptyButtonLink={showingBookingUrl}
      emptyButtonTarget="_blank"
      emptyDescription={
        <ShowingDetailEmptyStateDescription
          showingBookingUrl={showingBookingUrl}
        />
      }
    />
  )
}

export default ShowingDetailTabBookings
