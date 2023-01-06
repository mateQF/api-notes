const logger = (req, res, next) => {
  console.log(req.method)
  console.log(req.path)
  console.log(req.body)
  console.log('------')
  next() // para que vaya a la siguiene ruta y no se quede ahi esperando
}

module.exports = logger
