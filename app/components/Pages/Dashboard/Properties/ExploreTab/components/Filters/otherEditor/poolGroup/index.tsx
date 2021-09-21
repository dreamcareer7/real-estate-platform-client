import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const PoolGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    updateFilters({
      pool: typeof newValue === 'boolean' ? newValue : null
    })
  }

  return (
    <EditorGroup title="Pool">
      <ToggleButtonGroup
        value={typeof filters.pool === 'boolean' ? filters.pool : 0}
        onChange={handleChange}
        className={classes.ToggleButtonGroup}
        exclusive
        aria-label="pool"
      >
        <ToggleButton
          className={classes.ToggleButton}
          // eslint-disable-next-line react/jsx-boolean-value
          value={true}
          aria-label="has pool"
        >
          Yes
        </ToggleButton>
        <ToggleButton
          className={classes.ToggleButton}
          value={false}
          aria-label="no pool"
        >
          No
        </ToggleButton>
        <ToggleButton
          className={classes.ToggleButton}
          value={0}
          aria-label="either"
        >
          Either
        </ToggleButton>
      </ToggleButtonGroup>
    </EditorGroup>
  )
}
