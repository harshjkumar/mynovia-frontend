'use client'
import { useState, useEffect } from 'react'
import { fetchDresses } from '@/lib/api'

export function useDresses(params = {}) {
  const [dresses, setDresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchDresses(params)
      .then(data => {
        if (!cancelled) setDresses(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [JSON.stringify(params)])

  return { dresses, loading, error }
}
