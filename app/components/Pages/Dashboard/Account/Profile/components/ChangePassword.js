import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Field, reduxForm } from 'redux-form'

import FormCard from './FormCard'
import SimpleField from './SimpleField'
import { getBrandInfo } from '../../../../Auth/SignIn'
import changePassword from '../../../../../../models/user/change-password'

const ChangePasswordForm = ({
  brand,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  onSubmitHandler,
  submitSuccessfully
}) => {
  const { brandColor } = getBrandInfo(brand)
  return (
    <FormCard title="Change Password">
      {!submitSuccessfully ? (
        <form
          className="c-account__form clearfix"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <Field
            name="old_password"
            type="password"
            label="Current Password"
            onChange={(e, value, newValue) => {
              if (submitError && newValue) {
                setSubmitError(false)
              }
            }}
            component={SimpleField}
          />
          <Field
            name="new_password"
            type="password"
            label="New Password"
            onChange={(e, value, newValue) => {
              if (submitError && newValue) {
                setSubmitError(false)
              }
            }}
            component={SimpleField}
          />
          <Field
            type="password"
            name="confirm_password"
            label="Confirm New Password"
            onChange={(e, value, newValue) => {
              if (submitError && newValue) {
                setSubmitError(false)
              }
            }}
            component={SimpleField}
          />
          {submitError && (
            <div className="c-auth__submit-error-alert">
              {submitError.message}
            </div>
          )}
          <button
            type="submit"
            className="c-auth__submit-btn"
            disabled={isSubmitting || pristine}
            style={{
              background: brandColor,
              opacity: isSubmitting || pristine ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p className="c-auth__submit-alert--success">
            Your password updated.
          </p>
        </div>
      )}
    </FormCard>
  )
}

const validate = values => {
  const errors = {}

  if (!values.old_password) {
    errors.old_password = 'Required'
  }

  if (!values.new_password) {
    errors.new_password = 'Required'
  } else if (values.new_password.length < 6) {
    errors.new_password = 'Your password must be at least 6 characters.'
  } else if (values.old_password === values.new_password) {
    errors.new_password =
      'Your new password can\'t be match with your old password!'
  }

  if (!values.confirm_password) {
    errors.confirm_password = 'Required'
  } else if (values.confirm_password !== values.new_password) {
    errors.confirm_password = 'Your passwords don\'t match'
  }

  return errors
}

const getErrorMessage = errorCode => {
  switch (errorCode) {
    case 403:
      return 'Your current Password is not correct!'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

export default compose(
  connect(({ brand }) => ({
    brand
  })),
  reduxForm({
    form: 'change_password',
    validate
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => async formInputsValue => {
      setIsSubmitting(true)
      const { old_password, new_password } = formInputsValue

      try {
        await changePassword({ old_password, new_password })
        setSubmitSuccessfully(true)
      } catch (errorCode) {
        setIsSubmitting(false)
        setSubmitError({ message: getErrorMessage(errorCode) })
      }
    }
  })
)(ChangePasswordForm)
