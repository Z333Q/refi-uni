'use client'
import { useAccount } from 'wagmi'
import { PortfolioOverview } from '../../../components/PortfolioOverview'
import { sdk } from '@refi/sdk-js'
import { useEffect, useState } from 'react'

export default function Page() {
  const { address } = useAccount()
  const [agent, setAgent] = useState<any>()

  useEffect(() => {
    async function load() {
      if (address) {
        const data = await sdk.metrics.getPortfolio(address)
        setAgent(data)
      }
    }
    load()
  }, [address])

  return <PortfolioOverview currentAgent={agent} />
}
