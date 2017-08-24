import React from 'react'
import { FormGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap'

const role_names = [
  'BuyerAgent',
  'CoBuyerAgent',
  'SellerAgent',
  'CoSellerAgent',
  'Buyer',
  'Seller',
  'Title',
  'Lawyer',
  'Lender',
  'TeamLead',
  'Appraiser',
  'Inspector',
  'Tenant',
  'Landlord'
]

export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validation: {},
      form: {}
    }
  }

  setForm(field, value) {
    const { form } = this.state

    this.setState({
      form: {
        ...form,
        [field]: value
      }
    }, this.validate)
  }

  validate() {
    const fields = ['first_name', 'last_name', 'email', 'role']
    const { form } = this.state
    const validation = {}
    let validated = true

    fields.forEach(key => {
      if (!form[key] || form[key].length === 0) {
        validation[key] = 'error'
        validated = false
      }
    })

    this.setState({ validation })

    if (validated) {
      this.props.onFormCompleted(form)
    }
  }

  render() {
    const { form, validation } = this.state

    return (
      <form>
        <FormGroup validationState={validation.first_name}>
          <FormControl
            required
            onChange={e => this.setForm('first_name', e.target.value)}
            placeholder="First Name"
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup validationState={validation.last_name}>
          <FormControl
            required
            onChange={e => this.setForm('last_name', e.target.value)}
            placeholder="Last Name"
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup validationState={validation.email}>
          <FormControl
            required
            onChange={e => this.setForm('email', e.target.value)}
            placeholder="Email"
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup validationState={validation.role}>
          <DropdownButton
            id="deal-esign-add-role--role"
            title={form.role || 'Select Role'}
          >
            {
              role_names.map(name =>
                <MenuItem
                  key={`ROLE_${name}`}
                  onClick={() => this.setForm('role', name)}
                >
                  { name }
                </MenuItem>
              )
            }

          </DropdownButton>
          <FormControl.Feedback />
        </FormGroup>
      </form>
    )
  }
}
