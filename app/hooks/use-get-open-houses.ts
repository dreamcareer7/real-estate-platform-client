import { useEffect, useState, useCallback } from 'react'

import { getTasks } from 'models/tasks/get-tasks'

interface GetOpenHouses {
  error: string
  isFetching: boolean
  list: IEvent[]
  reloadList: () => Promise<void>
}

/**
 * Fetch all open houses event
 */
export function useGetOpenHouses(): GetOpenHouses {
  const [list, setList] = useState<IEvent[]>([])
  const [error, setError] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  const fetch = useCallback(async function fetch() {
    try {
      setIsFetching(true)

      const response = await getTasks({
        task_type: 'Open House'
      })

      setList(response.data)
    } catch (error) {
      console.log(error)
      setError(error.message)
    } finally {
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  function reloadList() {
    return fetch()
  }

  return { list, reloadList, isFetching, error }
}
