export function getTodayDate() {
  const today = new Date()

  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)

  return today.getTime()
}
