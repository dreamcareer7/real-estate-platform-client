import React from 'react'
import { ContentBlock, EditorState } from 'draft-js'

import {
  Box,
  createStyles,
  Divider,
  IconButton,
  makeStyles,
  Theme,
  Tooltip
} from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

import IconDelete from '../../../SvgIcons/Delete/IconDelete'
import { BlockAlignmentButtons } from './AlignmentButtons'
import { ImageSizeEditor } from './ImageSizeEditor'
import { removeBlock } from '../../modifiers/remove-block'
import { useToolbarIconClass } from '../../hooks/use-toolbar-icon-class'

const styles = (theme: Theme) =>
  createStyles({
    divider: {
      height: 'inherit',
      alignSelf: 'stretch',
      margin: theme.spacing(0.5, 1)
    }
  })
const useStyles = makeStyles(styles, { name: 'ImageToolbar' })

interface Props {
  editorState: EditorState
  onChange: (editorState: EditorState) => void
  block: ContentBlock | null
}

export function ImageToolbar(props: Props & ClassesProps<typeof styles>) {
  const classes = useStyles(props)

  const iconClassName = useToolbarIconClass()

  const remove = () =>
    props.block &&
    props.onChange(removeBlock(props.editorState, props.block.getKey()))

  return (
    <Box display="flex" alignItems="center">
      <BlockAlignmentButtons
        editorState={props.editorState}
        onChange={props.onChange}
        block={props.block}
      />
      <Divider orientation="vertical" className={classes.divider} />
      <ImageSizeEditor
        editorState={props.editorState}
        onChange={props.onChange}
        block={props.block}
      />
      <Divider orientation="vertical" className={classes.divider} />
      <Tooltip title="Remove Image">
        <IconButton size="small" edge="start" onClick={remove}>
          <IconDelete className={iconClassName} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
