import { useTheme } from '@material-ui/styles'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import { Field, reduxForm } from 'redux-form'

import { useSearchParams } from '@app/hooks/use-search-param'
import { withRouter } from '@app/routes/with-router'
import { Logo } from '@app/views/components/OAuthPageLayout/Logo'
import { PoweredBy } from '@app/views/components/OAuthPageLayout/PoweredBy'

import updatePassword from '../../../../../models/auth/password/update'
import { createUrlSearch } from '../../../../../utils/helpers'
import Button from '../../../../../views/components/Button/ActionButton'
import ConflictModal from '../../../Branch/components/ConflictModal'
import SimpleField from '../../../Dashboard/Account/Profile/components/SimpleField'

const Reset = ({
  user,
  submitError,
  isSubmitting,
  setIsSubmitting,
  setSubmitError,
  submitSuccessfully,
  setSubmitSuccessfully
}) => {
  const theme = useTheme()
  const isDisabled = isSubmitting
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const onSubmitHandler = event => {
    event.preventDefault()

    const password = event.target.password.value

    setIsSubmitting(true)

    updatePassword({ email, password, token })
      .then(statusCode => {
        if (statusCode === 200) {
          setIsSubmitting(false)
          setSubmitSuccessfully(email)
        }
      })
      .catch(() => {
        setIsSubmitting(false)
        setSubmitError(true)
      })
  }

  return (
    <div className="signin-page-wrapper">
      {user ? (
        <ConflictModal
          params={{
            userInfo: user,
            actionButtonProps: {
              text: 'Sign out',
              href: `/signout${createUrlSearch(
                {
                  token,
                  email,
                  redirectFromSignout: '/password/reset'
                },
                undefined,
                true
              )}`
            },
            messageText:
              'You are logged in on this device. To reset your password, please sign out.'
          }}
        />
      ) : (
        <article className="c-auth">
          <header className="c-auth__header">
            <a href="/" tabIndex={-1}>
              <Logo />
            </a>
            {!submitSuccessfully && (
              <p className="c-auth__subtitle">Reset your password</p>
            )}
          </header>
          <main className="c-auth__main">
            {!submitSuccessfully ? (
              <form onSubmit={onSubmitHandler}>
                <Field
                  autoFocus
                  name="password"
                  type="password"
                  label="New Password"
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                  onChange={(e, value, newValue) => {
                    if (submitError && newValue) {
                      setSubmitError(false)
                    }
                  }}
                  component={SimpleField}
                />
                {submitError && (
                  <div className="c-auth__submit-error-alert">
                    Password recovery email expired.{' '}
                    <Link to="/password/forgot">Request a new password</Link>.
                  </div>
                )}
                <Button
                  type="submit"
                  isBlock
                  disabled={isDisabled}
                  style={{ marginBottom: '2em' }}
                  brandColor={theme.palette.primary.main}
                >
                  {isSubmitting ? 'Submitting...' : 'Reset Password'}
                </Button>
                <p className="c-auth__subtitle">
                  <small>Code not working?</small>&nbsp;&nbsp;
                  <Link to="/password/forgot">Try sending it again</Link>
                </p>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p className="c-auth__submit-alert--success">
                  <span>Your account password for email address </span>
                  <b>{submitSuccessfully}</b> is now updated.
                  <br />
                  <span>Please </span>
                  <Link
                    to={`/signin?username=${encodeURIComponent(
                      submitSuccessfully
                    )}`}
                  >
                    sign in
                  </Link>
                  .
                </p>
              </div>
            )}
          </main>
        </article>
      )}
      <PoweredBy />
    </div>
  )
}

const validate = values => {
  const errors = {}

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
    errors.password = 'Your password must be at least 6 characters.'
  }

  if (!values.confirm_password) {
    errors.confirm_password = 'Required'
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = "Your passwords don't match"
  }

  return errors
}
export default compose(
  connect(({ brand }) => {
    return {
      brand
    }
  }),
  reduxForm({
    form: 'reset',
    validate
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false)
)(withRouter(Reset))
