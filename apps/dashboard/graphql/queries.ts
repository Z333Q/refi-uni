import { gql } from '@apollo/client'

export const GET_PNL = gql`
  query GetPnl($wallet: String!) {
    pnl(wallet: $wallet) {
      total
      sharpe
      var
    }
  }
`

export const TRADE_FILLED = gql`
  subscription TradeFilled {
    tradeFilled {
      id
      txHash
      token
      quantity
      price
      latency
    }
  }
`
