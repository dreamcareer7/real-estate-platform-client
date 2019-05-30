/**
 * validate string value
 */
export function isValidNumber(value, requiredFields, fieldName) {
  if (!value.toString().length && !requiredFields.includes(fieldName)) {
    return true
  }

  return /^\d+$/.test(value)
}