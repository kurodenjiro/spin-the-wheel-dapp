import BN from 'bn.js'

const Casino = artifacts.require('Casino')

contract('Casino', (accounts) => {
  const alice = accounts[0]!

  it('should return less money', async () => {
    const casino = await Casino.deployed()
    const balance = new BN(await web3.eth.getBalance(alice))
    await casino.spinWheel()
    const newBalance = new BN(await web3.eth.getBalance(alice))
    assert(newBalance.lt(balance))
  })
})
