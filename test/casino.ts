import BN from 'bn.js'
import { toWei } from 'web3-utils'
import { CasinoInstance, MockDaiInstance } from '../types/truffle-contracts'

const Casino = artifacts.require('Casino')
const MockDai = artifacts.require('MockDai')

contract('Casino', (accounts) => {
  const alice = accounts[0]!
  let casino: CasinoInstance
  let token: MockDaiInstance
  beforeEach(async () => {
    casino = await Casino.new()
    token = await MockDai.new()
    await token.setBalance(casino.address, toWei('1000'))
    await token.setBalance(alice, toWei('1000'))
  })

  async function approveAndSpinWheel({ account, bet }: { account: string, bet: BN }) {
    await token.approve(casino.address, bet, { from: account })
    return await casino.spinWheel(token.address, bet, { from: account })
  }

  it('should send tokens back and forth', async () => {
    const aliceBalanceBefore = new BN(await token.balanceOf(alice))
    const casinoBalanceBefore = new BN(await token.balanceOf(casino.address))

    const bet = new BN(toWei('1'))
    const tx = await approveAndSpinWheel({ bet, account: alice })
    const { potentialPrizes, wonPrizeIndex } = tx.logs[0]!.args
    const prize = potentialPrizes[wonPrizeIndex.toNumber()]!

    const aliceCurrentBalance = new BN(await token.balanceOf(alice))
    const aliceExpectedBalance = aliceBalanceBefore.sub(bet).add(prize)
    assert(aliceCurrentBalance.eq(aliceExpectedBalance), `${aliceCurrentBalance} != ${aliceExpectedBalance}`)

    const casinoCurrentBalance = new BN(await token.balanceOf(casino.address))
    const casinoExpectedBalance = casinoBalanceBefore.add(bet).sub(prize)
    assert(casinoCurrentBalance.eq(casinoExpectedBalance), `${casinoCurrentBalance} != ${casinoExpectedBalance}`)
  })

  it('should emit exactly one event', async () => {
    const tx = await approveAndSpinWheel({ account: alice, bet: new BN(toWei('1')) })
    const events = tx.logs
    assert.equal(events.length, 1)
    const event = events[0]!
    assert.equal(event.event, 'WheelSpin')
    assert.equal(event.args.player, alice)
  })

  it('should emit wonPrizeIndex within bounds', async () => {
    const tx = await approveAndSpinWheel({ account: alice, bet: new BN(toWei('1')) })
    const { wonPrizeIndex, potentialPrizes } = tx.logs[0]!.args
    assert(wonPrizeIndex.gte(new BN('0')))
    assert(wonPrizeIndex.lt(new BN(potentialPrizes.length)))
  })

  it('should emit average of prizes less than the bet', async () => {
    const bet = new BN(toWei('1'))
    const tx = await approveAndSpinWheel({ account: alice, bet })
    const event = tx.logs[0]!
    const avgPrize = avg(event.args.potentialPrizes)
    assert(avgPrize.lt(bet), `${avgPrize} is not less than ${bet}`)
  })
})

// TODO: move this to utils
function avg(nums: BN[]) {
  return nums.reduce((s, x) => s.add(x), new BN('0')).div(new BN(nums.length))
}
