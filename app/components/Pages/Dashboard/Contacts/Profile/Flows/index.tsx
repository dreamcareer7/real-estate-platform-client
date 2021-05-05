import React from 'react'
import { Box } from '@material-ui/core'

import { mdiLightningBolt } from '@mdi/js'

import AddToFlowButton from 'components/AddToFlowButton'

import List from './List/List'
import { SectionButton } from '../components/Section/Button'

// const useStyles = makeStyles(
//   (theme: Theme) => ({
//     button: {
//       color: theme.palette.grey['500'],
//       marginLeft: 0
//     }
//   }),
//   { name: 'AddFlow' }
// )

interface Props {
  addCallback: () => void
  contactId: UUID
  flows: TBrandFlow<'steps'>[] | null
  onStop: (flowId: UUID) => Promise<void>
}

function FlowsList({ flows, contactId, onStop, addCallback }: Props) {
  // const classes = useStyles()

  return (
    <Box px={3}>
      {Array.isArray(flows) && <List items={flows} onStop={onStop} />}
      <AddToFlowButton
        activeFlows={[]}
        callback={addCallback}
        contacts={{ ids: [contactId] }}
        buttonRenderer={buttonProps => (
          <SectionButton
            label="Enroll To a Flow"
            icon={mdiLightningBolt}
            onClick={e => buttonProps?.onClick(e)}
          />
        )}
      />
    </Box>
  )
}

export default FlowsList
