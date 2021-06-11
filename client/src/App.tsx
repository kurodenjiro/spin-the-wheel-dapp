import { createContext, FC, useContext } from 'react'
import { useQuery } from 'react-query'
import Web3 from 'web3'
import { fromWei } from 'web3-utils'
import { Casino as CasinoType } from '../../types/web3-v1-contracts/Casino'
import { CasinoWheelPage } from './pages/CasinoWheelPage'
import Casino from './contracts/Casino.json'
import { getWeb3 } from './getWeb3'

export const Web3Context = createContext(undefined as unknown as Web3)
export const AccountContext = createContext(undefined as unknown as string)
export const CasinoContext = createContext(undefined as unknown as CasinoType)

export const App: FC = () => {
  const web3Loader = useQuery('web3', async () => {
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]

    // Get contract instance
    const networkId = await web3.eth.net.getId()
    // @ts-expect-error
    const deployedNetwork = Casino.networks[networkId]
    const casino = new web3.eth.Contract(
      // @ts-expect-error
      Casino.abi,
      deployedNetwork && deployedNetwork.address,
    ) as unknown as CasinoType

    return {
      web3,
      account,
      casino,
    }
  })

  if (web3Loader.isLoading) {
    return <div>Loading web3...</div>
  }
  if (!web3Loader.isSuccess) {
    return <div>Error loading web3</div>
  }

  const { web3, account, casino } = web3Loader.data

  if (account == null) {
    return <div>No account connected</div>
  }

  return (
    <Web3Context.Provider value={web3}>
      <AccountContext.Provider value={account}>
        <CasinoContext.Provider value={casino}>
          <div>Your address: {account}</div>
          <DisplayBalance />
          <CasinoWheelPage />
        </CasinoContext.Provider>
      </AccountContext.Provider>
    </Web3Context.Provider>
  )
}


const DisplayBalance: FC = () => {
  const web3 = useContext(Web3Context)
  const account = useContext(AccountContext)

  const balance = useQuery(['balance', account], () => {
    return web3.eth.getBalance(account)
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
