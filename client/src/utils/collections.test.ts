import { shuffleExceptAt } from './collections'

describe('shuffleExceptAt', () => {
  test('keeps element at `index` inplace', () => {
    expect(shuffleExceptAt([0, 1, 2, 3, 4, 5], 3)[3]).toEqual(3)
  })
})
