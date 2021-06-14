import BN from 'bn.js'
import { toWei } from 'web3-utils'

const Casino = artifacts.require('Casino')

contract('Casino', (accounts) => {
  const alice = accounts[0]!

  it('should send money back and forth', async () => {
    const casino = await Casino.deployed()
    const aliceBalanceBefore = new BN(await web3.eth.getBalance(alice))
    const casinoBalanceBefore = new BN(await web3.eth.getBalance(casino.address))

    const bet = new BN(toWei('1'))
    const gasPrice = new BN(toWei('10', 'gwei'))
    const tx = await casino.spinWheel({ from: alice, value: bet, gasPrice })

    const { potentialPrizes, wonPrizeIndex } = tx.logs[0]!.args
    const prize = potentialPrizes[wonPrizeIndex.toNumber()]!
    const fee = gasPrice.mul(new BN(tx.receipt.gasUsed))

    const aliceCurrentBalance = new BN(await web3.eth.getBalance(alice))
    const aliceExpectedBalance = aliceBalanceBefore.sub(fee).sub(bet).add(prize)
    assert(aliceCurrentBalance.eq(aliceExpectedBalance), `${aliceCurrentBalance} != ${aliceExpectedBalance}`)

    const casinoCurrentBalance = new BN(await web3.eth.getBalance(casino.address))
    const casinoExpectedBalance = casinoBalanceBefore.add(bet).sub(prize)
    assert(casinoCurrentBalance.eq(casinoExpectedBalance), `${casinoCurrentBalance} != ${casinoExpectedBalance}`)
  })

  it('should emit exactly one event', async () => {
    const casino = await Casino.deployed()
    const tx = await casino.spinWheel({ from: alice, value: new BN(toWei('1')) })
    const events = tx.logs
    assert.equal(events.length, 1)
    const event = events[0]!
    assert.equal(event.event, 'WheelSpin')
    assert.equal(event.args.player, alice)
  })

  it('should emit wonPrizeIndex within bounds', async () => {
    const casino = await Casino.deployed()
    const tx = await casino.spinWheel({ from: alice, value: new BN(toWei('1')) })
    const { wonPrizeIndex, potentialPrizes } = tx.logs[0]!.args
    assert(wonPrizeIndex.gte(new BN('0')))
    assert(wonPrizeIndex.lt(new BN(potentialPrizes.length)))
  })

  it('should emit average of prizes less than the bet', async () => {
    const casino = await Casino.deployed()
    const bet = new BN(toWei('1'))
    const tx = await casino.spinWheel({ from: alice, value: bet })
    const event = tx.logs[0]!
    const avgPrize = avg(event.args.potentialPrizes)
    assert(avgPrize.lt(bet), `${avgPrize} is not less than ${bet}`)
  })
})

// TODO: move this to utils
function avg(nums: BN[]) {
  return nums.reduce((s, x) => s.add(x), new BN('0')).div(new BN(nums.length))
}
