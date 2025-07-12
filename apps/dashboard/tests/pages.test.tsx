import { render } from '@testing-library/react'
import Index from '../app/page'
import Wizard from '../app/(wizard)/page'
import Portfolio from '../app/(main)/portfolio/page'
import Basket from '../app/(main)/basket/[id]/page'
import Trades from '../app/(main)/trades/page'
import Proofs from '../app/(main)/proofs/page'
import Wallet from '../app/(main)/wallet/page'
import Api from '../app/(dev)/api/page'
import Alerts from '../app/(settings)/alerts/page'
import Compliance from '../app/(admin)/compliance/page'
import Guardian from '../app/(admin)/guardian/page'

describe('page snapshots', () => {
  const pages = [
    ['index', <Index />],
    ['wizard', <Wizard />],
    ['portfolio', <Portfolio />],
    ['basket', <Basket />],
    ['trades', <Trades />],
    ['proofs', <Proofs />],
    ['wallet', <Wallet />],
    ['api', <Api />],
    ['alerts', <Alerts />],
    ['compliance', <Compliance />],
    ['guardian', <Guardian />],
  ] as const

  it.each(pages)('%s renders', (_, page) => {
    const { container } = render(page)
    expect(container).toMatchSnapshot()
  })
})
