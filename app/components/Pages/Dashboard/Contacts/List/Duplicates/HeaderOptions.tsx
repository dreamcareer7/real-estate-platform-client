import React, { useState } from 'react'

import { Box, Button, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  dismissAllButton: {
    margin: theme.spacing(0, 1)
  }
}))

interface Props {
  listsLength: number
  onDismissAllClick: () => Promise<void>
  onMergeAllClick: () => Promise<void>
}

export default function HeaderOptions({
  listsLength,
  onDismissAllClick,
  onMergeAllClick
}: Props) {
  const classes = useStyles()
  const [isMerging, setIsMerging] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)

  const getDismissAllButtonCopy = () => {
    if (isDismissing) {
      return 'Dismissing'
    }

    return 'Dismiss All'
  }

  const getMergeAllButtonCopy = () => {
    const label = `${listsLength} contact list`

    if (isMerging) {
      return `Merging ${label}`
    }

    return `Merge ${label}`
  }

  const handleDismissAll = async () => {
    setIsDismissing(true)

    await onDismissAllClick()

    setIsDismissing(false)
  }

  const handleMergeAll = async () => {
    setIsMerging(true)

    await onMergeAllClick()

    setIsMerging(false)
  }

  if (listsLength === 0) {
    return null
  }

  return (
    <Box textAlign="right">
      <Button
        variant="text"
        size="large"
        disabled={isMerging || isDismissing}
        onClick={handleDismissAll}
        className={classes.dismissAllButton}
      >
        {getDismissAllButtonCopy()}
      </Button>
      <Button
        variant="outlined"
        size="large"
        disabled={isMerging || isDismissing}
        onClick={handleMergeAll}
      >
        {getMergeAllButtonCopy()}
      </Button>
    </Box>
  )
}
