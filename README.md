# Promises-least

A simple util for handling promises.

## What is it for?

If you have several promises and you need to do some actions when at least one of these promises resolves. You will receive collection of values and promises result.

Also, it has concurrent mode, so when one of your promises resolves or rejects, you will receive only this value and accordingly 

## Usage

Function receives array of promises and returns promise, that resolves when at least one of provided promises was resolved. If all were rejected - it will be rejected too.

Returns collection of values that promises were rejected/resoled and results of promise (resolved - `true`, rejected - `true`).

All values returns with respect of original array order, not promises resolving order.

In concurrent mode the first resulted promise is returned.

### Default mode.

```js
import promisesLeast from 'promises-least'

const promise1 = someRequest1()
const promise2 = somePromise2()
const promise3 = somePromise3()

promisesLeast([promise1, promise2, promise3])
  .then((collection) => {
    // make some things with resolved collection
  })
  .catch((collection) => {
    // make some with rejected one
  })
```

With async/await:

```js
import promisesLeast from 'promises-least'

const promise1 = someRequest1() // resolves with 1
const promise2 = somePromise2() // rejects with 2
const promise3 = somePromise3() // rejects with 3

try {
  const collection = promisesLeast([promise1, promise2, promise3])

  /*
    {
      values: [1, 2, 3],
      results: [true, false, false]
    }
  */

  // make some things with resolved collection
} catch (collection) {
  // make some with rejected one
}
```

### Concurrent mode

Results with first resolved or rejected promise

## API

`promises-least` receives array of promises and option for concurrent mode.

```ts
interface PromisesLeast {
  iterable: Promise<any>[],
  concurrent?: boolean
}
```

Returns collection in default mode:

```ts
interface PromisesLeastResult {
  values: any[],
  results: boolean[]
}
```

In concurrent mode promise is resulting with just promise value.

# TODO's

- [] for concurrent mode add option for resulting with only first resolved/rejected promise
