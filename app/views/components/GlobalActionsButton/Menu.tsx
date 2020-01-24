import React from 'react'
import {
  Theme,
  makeStyles,
  createStyles,
  Divider,
  Popover,
  List,
  ListSubheader,
  Typography,
  IconButton
} from '@material-ui/core'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import { Item } from './types'
import MenuItem from './MenuItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemsWrapper: {
      margin: theme.spacing(0, 1)
    },
    closeIconButtonLabel: {
      width: theme.spacing(2),
      height: theme.spacing(2)
    },
    subheader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 2)
    }
  })
)

interface Props {
  items: Item[]
  anchorEl: HTMLElement | null
  onItemClick: (item: Item) => void
  onClose: () => void
}

export default function Menu({ items, anchorEl, onItemClick, onClose }: Props) {
  const classes = useStyles()
  const open = Boolean(anchorEl)

  const handleItemClick = (item: Item) => {
    onItemClick(item)
  }

  return (
    <Popover open={open} anchorEl={anchorEl} onClose={onClose}>
      <List
        dense
        subheader={
          <>
            <ListSubheader disableGutters className={classes.subheader}>
              <Typography variant="caption">Actions</Typography>
              <IconButton
                size="small"
                classes={{ label: classes.closeIconButtonLabel }}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            </ListSubheader>
            <Divider />
          </>
        }
      >
        <div className={classes.itemsWrapper}>
          {items.map((item, index) => (
            <MenuItem key={index} item={item} onClick={handleItemClick} />
          ))}
        </div>
      </List>
    </Popover>
  )
}
