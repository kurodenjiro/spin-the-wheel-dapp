import _ from 'lodash'

/**
 * Shuffle all elements except the element at `index`.
 */
export function shuffleExceptAt<T>(array: T[], index: number): T[] {
  const before = array.slice(0, index)
  const after = array.slice(index + 1)
  const shuffled = _.shuffle([...before, ...after])
  const element = array[index]!
  return [
    ...shuffled.slice(0, index),
    element,
    ...shuffled.slice(index),
  ]
}
