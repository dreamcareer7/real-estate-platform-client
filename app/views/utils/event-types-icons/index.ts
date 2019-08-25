import IconCall from 'components/SvgIcons/CallOutline/IconCallOutline'
import IconFollowUp from 'components/SvgIcons/FollowUp/IconFollowUp'
import Text from 'components/SvgIcons/Text/IconText'
import Chat from 'components/SvgIcons/Chat/IconChat'
import Email from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import IconMessage from 'components/SvgIcons/Mail/IconMail'
import OpenHouse from 'components/SvgIcons/OpenHouse/IconOpenHouse'
import Tour from 'components/SvgIcons/Tour/IconTour'
import Other from 'components/SvgIcons/MenuRounded/IconMenuRounded'
import Closing from 'components/SvgIcons/Closing/IconClosing'
import IconInPerson from 'components/SvgIcons/InPerson/IconInPerson'
import IconTodo from 'components/SvgIcons/Todo/IconTodo'
import IconListingAppointment from 'components/SvgIcons/ListingAppointment/IconListingAppointment'
import TouchDate from 'components/SvgIcons/Time/IconTime'
import IconTaskCritical from 'components/SvgIcons/TaskCritical/IconTaskCritical'

export interface EventTypeIcon {
  name: string
  color: string
  icon: React.FC<any>
}

export const eventTypesIcons = [
  {
    name: 'Call',
    icon: IconCall,
    color: '#04c6d9'
  },
  {
    name: 'In-Person Meeting',
    icon: IconInPerson,
    color: '#f7a700'
  },
  {
    name: 'Text',
    icon: Text,
    color: '#000'
  },
  {
    name: 'Chat',
    icon: Chat,
    color: '#ff00bf'
  },
  {
    name: 'Mail',
    icon: IconMessage,
    color: '#7ed321'
  },
  {
    name: 'Email',
    icon: Email,
    color: '#8f6cf0'
  },
  {
    name: 'Open House',
    icon: OpenHouse,
    color: '#50e3c2'
  },
  {
    name: 'Tour',
    icon: Tour,
    color: '#bd10e0'
  },
  {
    name: 'TouchDate',
    icon: TouchDate,
    color: '#f7a700'
  },
  {
    name: 'Closing',
    icon: Closing,
    color: '#287700'
  },
  {
    name: 'Follow Up',
    icon: IconFollowUp,
    color: '#9013fe'
  },
  {
    name: 'Todo',
    icon: IconTodo,
    color: '#4e709d'
  },
  {
    name: 'ListingAppointment',
    icon: IconListingAppointment,
    color: '#8b572a'
  },
  {
    name: 'Task Critical',
    icon: IconTaskCritical,
    color: '#f5a623'
  },
  {
    name: 'Other',
    icon: Other,
    color: '#9013fe'
  }
].reduce((acc, icon) => {
  return {
    ...acc,
    [icon.name]: icon
  }
}, {}) as Record<string, EventTypeIcon>