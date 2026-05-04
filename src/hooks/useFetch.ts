import { useState, useEffect, useCallback, useRef } from 'react'

interface UseFetchOptions {
  fetchOptions?: RequestInit
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * Generic hook for GET requests.
 * The request is triggered automatically and can be re-fired via `refresh`.
 * Passing `null` or `undefined` as the url disables the request.
 *
 * @param url - URL of the resource to fetch (null/undefined = inactive)
 * @param options - Native fetch options (e.g. credentials, headers)
 * @returns `{ data, loading, error, refresh }`
 */
export const useFetch = <T>(
  url: string | null | undefined,
  options: UseFetchOptions = {}
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState<string | null>(null)
  const fetchOptionsRef = useRef(options.fetchOptions)

  const execute = useCallback(async () => {
    if (!url) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url, fetchOptionsRef.current)
      if (!response.ok) throw new Error('Erreur lors de la récupération des données')
      const json: T = await response.json()
      setData(json)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refresh: execute }
}
