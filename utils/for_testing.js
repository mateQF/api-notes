const palindrome = (string) => {
  if (typeof string === 'undefined') return
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (arr) => {
  if (typeof arr === 'undefined') return

  if (arr.length === 0) return 0

  let sum = 0
  arr.forEach(num => {
    sum += num
  })

  return sum / arr.length
}

module.exports = {
  palindrome,
  average
}
