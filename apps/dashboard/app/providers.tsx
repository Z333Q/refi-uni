'use client'
import { WagmiConfig, createConfig, http } from 'wagmi'
import { coinbaseWallet, injected } from 'wagmi/connectors'
import { base, baseSepolia } from 'viem/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ApolloClient, InMemoryCache, ApolloProvider, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { HttpLink } from '@apollo/client'

const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [injected(), coinbaseWallet({ appName: 'ReFinity' })],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPH_URL })
const wsLink = new GraphQLWsLink(
  createClient({ url: process.env.NEXT_PUBLIC_WS_URL as string })
)
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return (
      def.kind === 'OperationDefinition' && def.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={new QueryClient()}>
        <WagmiConfig config={config}>{children}</WagmiConfig>
      </QueryClientProvider>
    </ApolloProvider>
  )
}
