import React, { RefObject, useContext } from 'react'

import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Theme,
  Tooltip,
  MenuItem,
  MenuList
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { mdiDrag, mdiTrashCanOutline } from '@mdi/js'
import classNames from 'classnames'
import { isEqual } from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult
} from 'react-beautiful-dnd'

import { reorder } from '@app/utils/dnd-reorder'
import { BaseDropdown } from 'components/BaseDropdown'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { InlineEditableString } from 'components/inline-editable-fields/InlineEditableString'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useDictionary } from 'hooks/use-dictionary'

import { useTableStyles } from '../../../../../styles/table.style'
import { dealTaskTypeToString } from '../constants'

interface Props {
  checklist: IBrandChecklist
  updateTask: (task: IBrandChecklistTask) => void
  deleteTask: (checklistId: string, taskId: string) => void
  lastTaskNameEditorRef?: RefObject<any>
  onReorderTasks: (tasks: IBrandChecklistTask[]) => void
}

export function CheckListTable({
  checklist,
  updateTask,
  deleteTask,
  lastTaskNameEditorRef,
  onReorderTasks
}: Props) {
  const theme = useTheme<Theme>()
  const [isRemoving, setRemoving] = useDictionary<boolean>()
  const [isRequiredChanging, setRequiredChanging] = useDictionary<boolean>()

  const tableClasses = useTableStyles()

  const confirmationModal = useContext(ConfirmationModalContext)

  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return
    }

    const reorderedTasks = reorder<IBrandChecklistTask>(
      checklist.tasks || [],
      result.source.index,
      result.destination.index
    )

    onReorderTasks(
      reorderedTasks.map((task, order) => ({
        ...task,
        order: order + 1
      }))
    )
  }

  interface AclTypes {
    label: string
    value: IBrandChecklistTask['acl']
  }

  const aclTypes: AclTypes[] = [
    { label: 'Agents', value: ['Agents'] },
    { label: 'Back Office', value: ['BackOffice'] },
    { label: 'Agents & Back Office', value: ['Agents', 'BackOffice'] }
  ]

  const getAccessType = (acl: IBrandChecklistTask['acl']) => {
    return aclTypes.find(aclType => isEqual(aclType.value, acl))?.label
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table
        size="small"
        className={classNames(
          tableClasses.stripedRows,
          tableClasses.darkHeader
        )}
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Inbox</TableCell>
            <TableCell>Access</TableCell>
            <TableCell>Type</TableCell>
            <TableCell style={{ width: 1 }}>Required?</TableCell>
            <TableCell style={{ width: 1 }} />
          </TableRow>
        </TableHead>

        <Droppable droppableId="checklists-table">
          {(droppableProvided: DroppableProvided) => (
            <TableBody
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {(checklist.tasks || []).map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(
                    provided: DraggableProvided,
                    snapshot: DraggableStateSnapshot
                  ) => (
                    <TableRow
                      className={classNames({
                        [tableClasses.splitterRow]:
                          task.task_type === 'Splitter'
                      })}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        ...(snapshot.isDragging
                          ? {
                              display: 'table',
                              backgroundColor: theme.palette.action.selected
                            }
                          : {})
                      }}
                    >
                      <TableCell
                        style={{
                          width: '2%'
                        }}
                      >
                        <Tooltip title="Drag row to reorder">
                          <SvgIcon path={mdiDrag} />
                        </Tooltip>
                      </TableCell>

                      <TableCell
                        style={{
                          width: '26%'
                        }}
                      >
                        <InlineEditableString
                          {...(Array.isArray(checklist.tasks) &&
                          index === checklist.tasks.length - 1
                            ? { ref: lastTaskNameEditorRef }
                            : {})}
                          value={task.title}
                          TextFieldProps={{
                            fullWidth: true
                          }}
                          onSave={title =>
                            updateTask({
                              ...task,
                              title
                            })
                          }
                        >
                          {task.title ? (
                            <Typography
                              variant={
                                task.task_type === 'Splitter'
                                  ? 'subtitle1'
                                  : 'body1'
                              }
                            >
                              {task.title}
                            </Typography>
                          ) : (
                            <Typography color="textSecondary">
                              Unnamed Task
                            </Typography>
                          )}
                        </InlineEditableString>
                      </TableCell>

                      <TableCell
                        style={{
                          width: '26%'
                        }}
                      >
                        <InlineEditableString
                          {...(Array.isArray(checklist.tasks) &&
                          index === checklist.tasks.length - 1
                            ? { ref: lastTaskNameEditorRef }
                            : {})}
                          value={task.tab_name}
                          TextFieldProps={{
                            fullWidth: true
                          }}
                          onSave={tab_name =>
                            updateTask({
                              ...task,
                              tab_name
                            })
                          }
                        >
                          {task.tab_name ? (
                            <Typography
                              variant={
                                task.task_type === 'Splitter'
                                  ? 'subtitle1'
                                  : 'body1'
                              }
                            >
                              {task.tab_name}
                            </Typography>
                          ) : (
                            <Typography color="textSecondary">
                              Default
                            </Typography>
                          )}
                        </InlineEditableString>
                      </TableCell>

                      <TableCell
                        style={{
                          width: '21%'
                        }}
                      >
                        <BaseDropdown
                          buttonLabel={
                            <Typography>
                              {getAccessType(task.acl) ||
                                'Agents & Back Office'}
                            </Typography>
                          }
                          renderMenu={({ close }) => {
                            return (
                              <MenuList>
                                {aclTypes.map((acl, index) => (
                                  <MenuItem
                                    key={index}
                                    onClick={() => {
                                      updateTask({
                                        ...task,
                                        acl: acl.value
                                      })
                                      close()
                                    }}
                                  >
                                    <Typography variant="body1">
                                      {acl.label}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </MenuList>
                            )
                          }}
                        />
                      </TableCell>

                      <TableCell
                        style={{
                          width: '10%'
                        }}
                      >
                        {dealTaskTypeToString[task.task_type] || 'Unknown'}
                      </TableCell>
                      <TableCell
                        style={{
                          width: '10%'
                        }}
                      >
                        {task.task_type !== 'Splitter' && (
                          <Checkbox
                            disabled={isRequiredChanging(task.id)}
                            color="primary"
                            checked={task.required}
                            onChange={async event => {
                              setRequiredChanging(task.id, true)
                              await updateTask({
                                ...task,
                                required: event.target.checked
                              })
                              setRequiredChanging(task.id, false)
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          width: '5%'
                        }}
                      >
                        <IconButton
                          disabled={isRemoving(task.id)}
                          onClick={() => {
                            confirmationModal.setConfirmationModal({
                              message: 'Remove Task?',
                              description: `Are you sure you want to remove ${
                                task.title ? `"${task.title}"` : 'this task'
                              }?`,
                              confirmLabel: 'Yes, Remove it',
                              onConfirm: async () => {
                                setRemoving(task.id, true)
                                await deleteTask(checklist.id, task.id)
                                setRemoving(task.id, false)
                              }
                            })
                          }}
                        >
                          <SvgIcon path={mdiTrashCanOutline} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )}
                </Draggable>
              ))}

              {droppableProvided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  )
}
