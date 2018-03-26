/**
 * Normalize new contact form data as a new contact object.
 *
 * @param {object} formData The new contact form data.
 * @returns {object} Returns the new contact.
 */

export function normalizeNewContact(formData = {}) {
  let {
    first_name,
    last_name,
    title,
    middle_name,
    legal_prefix,
    legal_first_name,
    legal_middle_name,
    legal_last_name,
    stage,
    emails,
    phone_numbers,
    companies
  } = formData

  const contact = {
    type: 'contact',
    attributes: {
      names: [
        {
          type: 'name',
          title: title || legal_prefix,
          first_name: first_name || legal_first_name,
          middle_name: middle_name || legal_middle_name,
          last_name: last_name || legal_last_name
        }
      ],
      source_types: [
        {
          type: 'source_type',
          source_type: 'ExplicitlyCreated'
        }
      ]
    }
  }

  if (typeof stage === 'string') {
    const stages = [
      {
        type: 'stage',
        stage
      }
    ]

    const attributes = {
      ...contact.attributes,
      stages
    }

    contact.attributes = attributes
  }

  if (
    phone_numbers &&
    Array.isArray(phone_numbers) &&
    phone_numbers.length > 0
  ) {
    const phoneNumbers = attributeNormalizer({
      attributeName: 'phone_number',
      attributeValue: phone_numbers
    })

    const attributes = {
      ...contact.attributes,
      phone_numbers: phoneNumbers
    }

    contact.attributes = attributes
  }

  if (emails && Array.isArray(emails) && emails.length > 0) {
    const normalizedEmails = attributeNormalizer({
      attributeName: 'email',
      attributeValue: emails
    })

    const attributes = {
      ...contact.attributes,
      emails: normalizedEmails
    }

    contact.attributes = attributes
  }

  if (companies && Array.isArray(companies) && companies.length > 0) {
    const normalizedCompanies = attributeNormalizer({
      attributeName: 'company',
      attributeValue: companies
    })

    const attributes = {
      ...contact.attributes,
      companies: normalizedCompanies
    }

    contact.attributes = attributes
  }

  return contact
}

function attributeNormalizer({ attributeName, attributeValue }) {
  return attributeValue.filter(item => item).map((item, index) => ({
    type: attributeName,
    [attributeName]: item,
    is_primary: index === 0
  }))
}
