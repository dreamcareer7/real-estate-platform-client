import React, { useState } from 'react'
import {
  Button,
  Popper,
  List,
  ListItem,
  ListItemText,
  Typography,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'

import { StateContext, DispatchContext } from 'components/Grid/Table/context'

import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import IconHorizontalDots from 'components/SvgIcons/HorizontalDots/IconHorizontalDots'

import Email from '../../Actions/Email'
import MergeContacts from '../../Actions/MergeContacts'
import ExportContacts from '../../Actions/ExportContactsButton'
import TagContacts from '../../Actions/TagContacts'
import CreateEvent from '../../Actions/CreateEvent'
import AddToFlowAction from '../../Actions/AddToFlow'
import { ActionWrapper } from '../components/ActionWrapper'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& > *:not(:last-child)': {
        marginRight: theme.spacing(1)
      }
    },
    moreActionContainer: {
      background: theme.palette.background.paper,
      zIndex: 1100,
      borderRadius: theme.shape.borderRadius,
      boxShadow: `0 0 5px 0 ${theme.palette.text.hint}`
    }
  })
)

interface Props {
  state: StateContext
  dispatch: DispatchContext
  totalRowsCount: number
  reloadContacts: () => void
  onRequestDelete: () => void
  filters: any
  isFetching: boolean
  handleChangeContactsAttributes: any
}

export function TableActions({
  state,
  dispatch,
  filters,
  isFetching,
  totalRowsCount,
  reloadContacts,
  onRequestDelete,
  handleChangeContactsAttributes
}: Props) {
  const classes = useStyles()
  const [moreActionEl, setMoreActionEl] = useState<null | HTMLElement>(null)

  const toggleMoreAction = (event: React.MouseEvent<HTMLElement>) => {
    setMoreActionEl(moreActionEl ? null : event.currentTarget)
  }

  const isMoreActionOpen = Boolean(moreActionEl)
  const moreActionID = isMoreActionOpen ? 'more-action-popper' : undefined

  const entireMode = state.selection.isEntireRowsSelected
  const isAnyRowsSelected =
    state.selection.isEntireRowsSelected ||
    state.selection.selectedRowIds.length > 0

  const deselectRows = () => dispatch(resetRows())
  const deselectAndReload = () => {
    deselectRows()
    reloadContacts()
  }

  return (
    <div className={classes.container}>
      <ActionWrapper
        atLeast="one"
        bulkMode={entireMode}
        action="sending an email"
        disabled={!isAnyRowsSelected}
      >
        <Email
          disabled={!isAnyRowsSelected}
          selectedRows={state.selection.selectedRowIds}
        />
      </ActionWrapper>

      <ActionWrapper
        atLeast="one"
        bulkMode={entireMode}
        action="marketing"
        disabled={!isAnyRowsSelected}
      >
        <SendMlsListingCard
          disabled={!isAnyRowsSelected}
          selectedRows={state.selection.selectedRowIds}
        >
          Marketing
        </SendMlsListingCard>
      </ActionWrapper>

      <ActionWrapper
        bulkMode={entireMode}
        atLeast="one"
        action="tagging"
        disabled={!isAnyRowsSelected}
      >
        <TagContacts
          disabled={!isAnyRowsSelected}
          entireMode={entireMode}
          totalRowsCount={totalRowsCount}
          excludedRows={state.selection.excludedRows}
          selectedRows={state.selection.selectedRowIds}
          filters={filters.attributeFilters}
          searchText={filters.query}
          conditionOperator={filters.filter_type}
          users={filters.users}
          resetSelectedRows={deselectRows}
          handleChangeContactsAttributes={handleChangeContactsAttributes}
        />
      </ActionWrapper>

      <ActionWrapper
        atLeast="one"
        bulkMode={entireMode}
        action="creating an event"
        disabled={!isAnyRowsSelected}
      >
        <CreateEvent
          disabled={!isAnyRowsSelected}
          selectedRows={state.selection.selectedRowIds}
          submitCallback={deselectAndReload}
        />
      </ActionWrapper>

      <AddToFlowAction
        entireMode={entireMode}
        excludedRows={state.selection.excludedRows}
        selectedRows={state.selection.selectedRowIds}
        filters={filters}
        resetSelectedRows={deselectRows}
        reloadContacts={reloadContacts}
      />
      <ExportContacts
        excludedRows={state.selection.excludedRows}
        exportIds={state.selection.selectedRowIds}
        filters={filters.attributeFilters}
        flows={filters.flows}
        crmTasks={filters.crm_tasks}
        searchText={filters.text}
        conditionOperator={filters.filter_type}
        users={filters.users}
        disabled={isFetching}
      />
      <Button
        aria-describedby={moreActionID}
        size="small"
        onClick={toggleMoreAction}
      >
        <IconHorizontalDots />
      </Button>
      <Popper
        id={moreActionID}
        open={isMoreActionOpen}
        anchorEl={moreActionEl}
        className={classes.moreActionContainer}
      >
        <List>
          <ListItem
            button
            disabled={!isAnyRowsSelected}
            onClick={onRequestDelete}
          >
            <ActionWrapper
              bulkMode={entireMode}
              atLeast="one"
              action="delete"
              disabled={!isAnyRowsSelected}
            >
              <ListItemText>
                <Typography color="error">Delete</Typography>
              </ListItemText>
            </ActionWrapper>
          </ListItem>
          <MergeContacts
            acEntireMode={entireMode}
            disabled={
              !isAnyRowsSelected || state.selection.selectedRowIds.length < 2
            }
            selectedRows={state.selection.selectedRowIds}
            submitCallback={deselectAndReload}
          />
        </List>
      </Popper>
    </div>
  )
}
