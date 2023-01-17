const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of mateo', () => {
  const result = palindrome('mateo')

  expect(result).toBe('oetam')
})

test.skip('palindrome of epmty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
