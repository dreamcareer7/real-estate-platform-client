import React from 'react'
import { Box, Button, Typography } from '@material-ui/core'

import { Form } from 'react-final-form'

import { FormTextField, FormPhoneField } from 'components/final-form-fields'

import { ShowingRolePerson } from '../../types'

interface ShowingStepRolePersonEditFormProps {
  roleType: IShowingRoleType
  initialData: ShowingRolePerson
  onSubmit: (data: ShowingRolePerson) => void
  submitLabel?: string
}

function ShowingStepRolePersonEditForm({
  roleType,
  initialData,
  onSubmit,
  submitLabel = 'Next'
}: ShowingStepRolePersonEditFormProps) {
  const handleSubmit = e => {
    console.log('handleSubmit', e.values)
  }

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialData}
      render={({ handleSubmit, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Typography variant="h6">Listing {roleType} Info</Typography>
            </Box>

            <FormTextField label="First Name" name="first_name" required />
            <FormTextField label="Last Name" name="last_name" required />
            <FormTextField label="Email" name="email" required />
            <FormPhoneField label="Phone" name="phone_number" required />

            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                disabled={submitting}
                color="primary"
                variant="contained"
              >
                {submitLabel}
              </Button>
            </Box>
          </form>
        )
      }}
    />
  )
}

export default ShowingStepRolePersonEditForm
