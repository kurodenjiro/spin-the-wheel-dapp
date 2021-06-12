import BN from 'bn.js'
import { toWei } from 'web3-utils'

const Casino = artifacts.require('Casino')

contract('Casino', (accounts) => {
  const alice = accounts[0]!

  it('avg of potential prizes should be less than msg.value', async () => {
    const casino = await Casino.deployed()
    const balanceBefore = new BN(await web3.eth.getBalance(alice))
    const bet = new BN(toWei('1'))
    const res = await casino.spinWheel({ from: alice, value: bet })
    const events = res.logs
    assert.equal(events.length, 1)
    const event = events[0]!
    assert.equal(event.event, 'WheelSpin')

    const { potentialPrizes, wonPrizeIndex, player } = event.args
    assert.equal(player, alice)

    const avgPrize = potentialPrizes.reduce((s, x) => s.add(x), new BN('0')).div(new BN(potentialPrizes.length))
    assert(avgPrize.lt(bet), `${avgPrize} is not less than ${bet}`)

    assert(wonPrizeIndex.gte(new BN('0')))
    assert(wonPrizeIndex.lt(new BN(potentialPrizes.length)))
    const prize = potentialPrizes[wonPrizeIndex.toNumber()]!

    const currentBalance = new BN(await web3.eth.getBalance(alice))
    const expectedBalance = balanceBefore.sub(bet).add(prize)
    // TODO FIXME: take into account gas fee
    // assert(currentBalance.eq(expectedBalance), `${currentBalance} ${expectedBalance}`)
  })
})
