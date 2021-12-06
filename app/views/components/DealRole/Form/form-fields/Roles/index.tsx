import { useMemo } from 'react'

import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { FieldInputProps, FieldMetaState } from 'react-final-form'

import { useDealsRolesContext } from '@app/contexts/deals-roles-definitions/use-deals-roles-context'

interface RoleOption {
  value: string
  label: string
}

interface Props {
  meta: FieldMetaState<any>
  input: FieldInputProps<any, HTMLElement>
  isAllowedRole: (value: string, role: string) => boolean
  isRequired: boolean
}

export function Roles({ meta, input, isAllowedRole }: Props) {
  const role = input.value
  const { dealRolesList, dealRolesByName } = useDealsRolesContext()

  const options = useMemo(() => {
    let options: RoleOption[] = dealRolesList
      .filter(item => isAllowedRole(item.role, role))
      .map(item => ({
        value: item.role,
        label: item.title
      }))

    if (role && !options.length) {
      options = [
        {
          value: role,
          label: dealRolesByName[role]?.title
        }
      ]
    }

    if (options.length > 1) {
      options = [
        {
          value: '',
          label: 'Select a role'
        },
        ...options
      ]
    }

    return options
  }, [isAllowedRole, role, dealRolesByName, dealRolesList])

  return (
    <FormControl variant="outlined" size="small" fullWidth>
      <InputLabel id="create-role--role-type">Role</InputLabel>
      <Select
        labelId="create-role--role-type"
        label="Role *"
        value={input.value}
        error={meta.error}
        onChange={e => input.onChange(e.target.value)}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
