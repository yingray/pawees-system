const express = require('express')
const path = require('path')
const compression = require('compression')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 8081

app.use(compression())

/* PORTAL */
app.use('/', express.static(path.join(__dirname, 'web')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'web', 'index.html'))
})

/* ADMIN */
app.use('/admin/', express.static(path.join(__dirname, 'web', 'admin')))

app.get('/admin/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'web', 'admin', 'index.html'))
})

/* PAPER */
app.use('/paper', express.static('files'))

app.use(morgan('common'))

app.listen(port, () => {
  console.log(`Listening on port ${port} (http://localhost:${port})`)
})
