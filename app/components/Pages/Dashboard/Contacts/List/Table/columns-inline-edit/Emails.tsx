import { useCallback } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import { mdiEmailOutline } from '@mdi/js'

import { normalizeContactsForEmailCompose } from '@app/models/email/helpers/normalize-contact'
import { isEmail } from '@app/utils/validations'
import SendEmailButton from '@app/views/components/SendEmailButton'
import { SvgIcon, muiIconSizes } from '@app/views/components/SvgIcons'

import { InlineEditAttributeCell } from './AttributeCell'
import { InlineEditColumnsProps as EmailsInlineEditProps } from './type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    emailButton: {
      cursor: 'pointer',
      color: theme.palette.action.disabled
    }
  }),
  {
    name: 'EmailInlineEdit'
  }
)

export function EmailsInlineEdit({ contact, callback }: EmailsInlineEditProps) {
  const classes = useStyles()
  const updateContact = useCallback(() => {
    callback?.(contact.id)
  }, [callback, contact.id])

  return (
    <InlineEditAttributeCell
      attributeName="email"
      addLabel="Add Another Email"
      contact={contact as unknown as IContactWithAssoc<'contact.attributes'>}
      callback={updateContact}
      validateRules={{
        text: (value: string) => isEmail(value)
      }}
      actions={attribute => {
        const targetContact = attribute
          ? { ...contact, email: attribute.text }
          : contact

        return (
          <SendEmailButton
            recipients={normalizeContactsForEmailCompose([
              targetContact as unknown as IContact
            ])}
            render={({ onClick, testId }) => (
              <div
                onClick={onClick}
                data-test={testId}
                className={classes.emailButton}
              >
                <SvgIcon path={mdiEmailOutline} size={muiIconSizes.small} />
              </div>
            )}
          />
        )
      }}
    />
  )
}
