'use client'
import { useAccount, useConnect } from 'wagmi'
import { ConnectWizard } from '../../components/ConnectWizard'
import { useRouter } from 'next/navigation'
import { sdk } from '@refi/sdk-js'

export default function Page() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const { connect, connectors } = useConnect()

  if (!isConnected) {
    return (
      <button onClick={() => connect({ connector: connectors[0] })}>Connect</button>
    )
  }

  return (
    <ConnectWizard
      onComplete={async () => {
        await sdk.accounts.deployAgent()
        router.push('/portfolio')
      }}
      onClose={() => router.push('/')}
    />
  )
}
