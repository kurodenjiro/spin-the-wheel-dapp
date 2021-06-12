import { FC, useContext } from 'react'
import { useQuery } from 'react-query'
import { fromWei } from 'web3-utils'
import { AccountContext, Web3Context } from '../App'

export const DisplayBalance: FC = () => {
  const web3 = useContext(Web3Context)
  const account = useContext(AccountContext)

  const balance = useQuery(['balance', account], () => {
    return web3.eth.getBalance(account)
  }, {
    // Metamask steals window focus. Don't refetch automatically.
    refetchOnWindowFocus: false,
  })

  if (balance.isLoading) {
    return <div>Loading balance...</div>
  }

  if (balance.isError) {
    return <div>Error getting balance!</div>
  }

  if (balance.isIdle) {
    return <div>Idle...</div>
  }

  return <div>Your balance: {fromWei(balance.data)}</div>
}
