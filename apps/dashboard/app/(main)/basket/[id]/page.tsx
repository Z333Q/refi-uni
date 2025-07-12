'use client'
import { useParams } from 'next/navigation'
import { BasketDetail } from '../../../../components/BasketDetail'
import { sdk } from '@refi/sdk-js'
import { useEffect, useState } from 'react'

export default function Page() {
  const params = useParams()
  const [basket, setBasket] = useState<any>()

  useEffect(() => {
    async function load() {
      const data = await sdk.basket.get(params?.id as string)
      setBasket(data)
    }
    if (params?.id) load()
  }, [params?.id])

  return <BasketDetail currentAgent={basket} />
}
