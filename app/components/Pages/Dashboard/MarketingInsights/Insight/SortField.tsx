import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

import type { SortableColumnsType } from '../types'

interface Props {
  sortLabel: string
  onChange: (item: SortableColumnsType) => void
}

const sortableColumns: SortableColumnsType[] = [
  { label: 'Name A-Z', value: 'contact', ascending: true },
  { label: 'Name Z-A', value: 'contact', ascending: false },
  { label: 'Most Clicked', value: 'clicked', ascending: false },
  { label: 'Less Clicked', value: 'clicked', ascending: true },
  { label: 'Most Opened', value: 'opened', ascending: false },
  { label: 'Bounced', value: 'bounce', ascending: false },
  { label: 'Unsubscribed', value: 'unsubscribe', ascending: false }
]

export function SortFields({ sortLabel, onChange }: Props) {
  return (
    <BaseDropdown
      buttonLabel={sortLabel || 'A - Z'}
      renderMenu={({ close }) => (
        <div>
          {sortableColumns.map((column, index) => (
            <MenuItem
              key={index}
              value={index}
              onClick={async () => {
                onChange(column)
                close()
              }}
            >
              {column.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
