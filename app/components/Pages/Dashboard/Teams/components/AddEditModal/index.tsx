import { Field, Form } from 'react-final-form'

import Flex, { FlexItem } from 'styled-flex-component'

import * as React from 'react'

import { Modal, ModalHeader } from 'components/Modal/index'
import { TextInput } from 'components/Forms/TextInput'
import { SelectInput } from 'components/Forms/SelectInput'

import Button from 'components/Button/ActionButton'

import { BrandTypes, ITeam } from 'models/BrandConsole/types'

interface Props {
  close: () => void
  submit: (values: any) => void
  validate: (values: any) => { [fieldName: string]: string | undefined }
  isOpen: boolean
  team: ITeam | null
}

export function AddEditModal(props: Props) {
  return (
    <Modal
      style={{ content: { overflow: 'visible' } }}
      isOpen={props.isOpen}
      onRequestClose={props.close}
      autoHeight
    >
      <ModalHeader
        closeHandler={props.close}
        title={props.team ? 'Edit team' : 'Add team'}
      />
      <Form
        onSubmit={props.submit}
        validate={props.validate}
        initialValues={props.team || { brand_type: BrandTypes.Team }}
        render={({ handleSubmit, submitting }) => (
          <form
            onSubmit={handleSubmit}
            style={{ padding: '0.75rem' }}
            noValidate
          >
            <Flex>
              <FlexItem grow={1} basis="0%" style={{ padding: '0.75rem' }}>
                <Field
                  autoFocus
                  name="name"
                  label="Title"
                  required
                  component={TextInput as any}
                />
              </FlexItem>
              <FlexItem grow={1} basis="0%" style={{ padding: '0.75rem' }}>
                <Field
                  name="brand_type"
                  items={Object.values(BrandTypes).map(value => ({
                    label: value,
                    value
                  }))}
                  dropdownOptions={{
                    fullWidth: true
                  }}
                  label="Type"
                  component={SelectInput as any}
                />
              </FlexItem>
            </Flex>
            <Flex justifyEnd>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            </Flex>
          </form>
        )}
      />
    </Modal>
  )
}
