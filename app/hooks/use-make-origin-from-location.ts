import { useLocation } from 'react-use'

export function useMakeOriginFromLocation(): string {
  const location = useLocation()

  if (!location.pathname) {
    return ''
  }

  const originValue = encodeURIComponent(
    [location.pathname.slice(1), location.search ?? ''].join('')
  )

  return `origin=${originValue}`
}
