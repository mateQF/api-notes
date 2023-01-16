const { palindrome } = require('../utils/for_testing')

test('palindrome of mateo', () => {
  const result = palindrome('mateo')

  expect(result).toBe('oetam')
})

test('palindrome of epmty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
