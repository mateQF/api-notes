module.exports = (error, req, res, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    res.status(400).send({
      error: 'The id used is incorrect'
    })
  } else {
    res.status(500).end()
  }
}
