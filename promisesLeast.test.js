const promisesLeast = require('./promisesLeast')

const createPromise = (timeout, value, toResolve = true) => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (toResolve) {
        resolve(value)
      } else {
        reject(value)
      }
    }, timeout)
  })
)

const resolved1 = createPromise(300, 1, true)
const resolved2 = createPromise(100, 2, true)
const resolved3 = createPromise(200, 3, true)

const rejected1 = createPromise(300, 1, false)
const rejected2 = createPromise(100, 2, false)
const rejected3 = createPromise(200, 3, false)

test('Returns promise', () => {
  expect(promisesLeast([resolved1])).toBeInstanceOf(Promise)
})

describe('Receives iterable collection as argument or throws Error', () => {
  test('Resolves, when iterable is received', async () => {
    await expect(promisesLeast([resolved1])).resolves
    await expect(promisesLeast([])).resolves
  })

  test('Rejects if no iterable provided', () => {
    expect(() => promisesLeast()).toThrow()
    expect(() => promisesLeast('string')).toThrow()
  })
})

describe('Resolves when at least one provided promise resolves', () => {
  test('Resolves when all promises resolves', async () => {
    await expect(promisesLeast([resolved1, resolved2, resolved3])).resolves
  })

  test('Resolves when at least one promise resolves and rest rejects', async () => {
    await expect(promisesLeast([resolved1, resolved2, rejected3])).resolves
    await expect(promisesLeast([resolved1, rejected2, rejected3])).resolves
    await expect(promisesLeast([rejected1, rejected2, resolved3])).resolves
  })
})

test('Rejects only when all promises are rejected', async () => {
  await expect(promisesLeast([rejected1, rejected2, rejected3])).rejects
})

describe('Returns collection of resulted values, respecting the promises order', () => {
  test('Returns collection of values and promise resolve/reject result', async () => {
    
    await expect(promisesLeast([resolved1, resolved2, resolved3]))
      .resolves.toStrictEqual({
        results: [true, true, true],
        values: [1, 2, 3]
      })
    await expect(promisesLeast([rejected3, resolved1, resolved2]))
      .resolves.toStrictEqual({
        results: [false, true, true],
        values: [3, 1, 2]
      })
    await expect(promisesLeast([rejected3, resolved1, rejected2]))
      .resolves.toStrictEqual({
        results: [false, true, false],
        values: [3, 1, 2]
      })
    await expect(promisesLeast([rejected1, rejected2, resolved3]))
      .resolves.toStrictEqual({
        results: [false, false, true],
        values: [1, 2, 3]
      })
  })
  // test ('Returns resulted values, no mater if it`s resolved/rejected', () => {

  // })

  // test ('Returns promises resolve/reject results as boolean values', () => {

  // })
})
