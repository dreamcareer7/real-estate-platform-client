import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import { Recipient } from '../types'
import { isContactList } from './is-contact-list'
import { isContactTag } from './is-contact-tag'

export function recipientToString(
  recipient: Recipient,
  emailAttributeDef: IContactAttributeDef
): string {
  if (isContactList(recipient)) {
    return `${recipient.name} (List)`
  }

  if (isContactTag(recipient)) {
    return `${recipient.text} (Tag)`
  }

  if (recipient.email) {
    if (!recipient.contact || !recipient.contact.display_name) {
      return recipient.email
    }

    // We have a contact here which has a display name.
    // if it has multiple emails, show email in parentheses. Otherwise, only name
    let emails: string[] = []

    try {
      emails = getContactAttribute(recipient.contact, emailAttributeDef).map(
        attr => attr.text
      )
    } catch (e) {
      console.error('[RecipientToString]: ', e)
    }

    const showEmail = emails.length > 1

    // if all other emails are for different domains, then it's sufficient
    // to show the domain only, like Gmail
    const onlyShowDomain = emails.every(
      anEmail =>
        anEmail === recipient.email ||
        getEmailDomain(anEmail) !== getEmailDomain(recipient.email)
    )

    return (
      recipient.contact.display_name +
      (showEmail
        ? ` (${recipient.email
            .split('@')
            .slice(onlyShowDomain ? 1 : 0)
            .join('@')})`
        : '')
    )
  }

  return ''
}

function getEmailDomain(email) {
  return email.split('@')[1]
}
