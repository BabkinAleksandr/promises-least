function allPromisesResolved(results) {
  for (let i = 0; i < results.length; i++) {
    if (!(i in results)) {
      return false
    }
  }

  return true
}

function promisesLeast(iterable, concurrent) {
  if (!Array.isArray(iterable)) {
    throw new Error('Array should be provided')
  }

  return new Promise((resolve, reject) => {
    let resolved = false
    let data = {
      results: [],
      values: [],
    }

    if (iterable.length === 0) {
      resolve(data)
    }

    function handlePromisesResult(value, i, rejects) {
      data.values[i] = value

      if (concurrent) {
        if (rejects) {
          reject(value)
        } else {
          resolve(value)
        }
      }

      if (data.results.length === iterable.length && allPromisesResolved(data.results)) {
        if (resolved) {
          resolve(data)
        } else {
          reject(data)
        }
      }
    }

    for (let i = 0; i < iterable.length; i++) {
      iterable[i]
        .then((value) => {
          data.results[i] = true
          resolved = true

          handlePromisesResult(value, i)
        })
        .catch((value) => {
          data.results[i] = false

          handlePromisesResult(value, i, true)
        })
    }
  })
}

module.exports = promisesLeast
