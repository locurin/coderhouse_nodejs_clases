// dependencies: bcrypt, body-parser, express, fs
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')

// init the express app, add a body parser, select a port and define same log messages
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})
server.on('error', err => console.log(`Error en servidor: ${err}`))

// GET root path
app.get('/', (req, res) => {
    res.send({ mensaje: 'Hola mundo' })
})

// GET an array of object including all the products in the productos.json file
app.get('/productos', (req, res) => {
    const productos = require('./productos.json')
    res.send(productos)
})

// POST a new product to the productos.json file with a hashed id
app.post('/producto', (req, res) => {
    const producto = req.body
    const productos = require('./productos.json')
    producto.id = productos.length + 1
    producto.id = bcrypt.hashSync(producto.id.toString(), 10)
    productos.push(producto)
    fs.writeFileSync('./productos.json', JSON.stringify(productos))
    res.send(producto)
})

// GET a single product object from productos.json file by [hashed] id
app.get('/productos/:id', (req, res) => {
    const productos = require('./productos.json')
    const id = req.params.id
    const producto = productos.find(producto => bcrypt.compareSync(id, producto.id))
    res.send(producto)
})



