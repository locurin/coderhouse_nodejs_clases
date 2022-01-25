// dependencies: bcrypt, body-parser, express, Router fs
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const express = require('express')
const { Router } = require('express')
const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// init the express app, router, add a body parser, select a port and define same log messages

const app = express()
const router = new Router()
app.use('/', router)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static('public'))

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})
server.on('error', err => console.log(`Error en servidor: ${err}`))

// GET root path
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html')
    console.log('index.html fue cargada exitosamente.')
})

// GET an array of object including all the products in the productos.json file
router.get('/api/productos', (req, res) => {
    const productos = require('./productos.json')
    if (productos.length === 0) {
        res.status(404).send({ mensaje: 'No existen productos en la base de datos.' })
        console.log('No existen productos en la base de datos.')
    } else {
        res.send(productos)
        console.log('Se han enviado los productos.')
    }
    
})

// POST a new product to the productos.json file with a hashed id
router.post('/api/productos', upload.none(), (req, res) => {
    const producto = req.body
    const productos = require('./productos.json')
    const totalProductos = require('./totalProductosCreados.json')
    producto.id = totalProductos.total + 1
    producto.id = bcrypt.hashSync(producto.id.toString(), 10)
    productos.push(producto)
    fs.writeFileSync('./productos.json', JSON.stringify(productos))
    totalProductos.total += 1
    fs.writeFileSync('./totalProductosCreados.json', JSON.stringify(totalProductos))
    res.send(productos)
})

// GET a single product object from productos.json file by [hashed] id and display and error if none is found
router.get('/api/productos/:id', (req, res) => {
    const productos = require('./productos.json')
    const id = req.params.id
    const producto = productos.find((producto) => bcrypt.compareSync(id, producto.id))
    if (producto) {
        res.send(producto)
        console.log(`Producto encontrado: ${producto.title}`)
    } else {
        res.status(404).send({ mensaje: 'Producto no encontrado' })
        console.log(`Producto no encontrado: ${id}`)
    }
})

// DELETE a product from productos.json file by [hashed] id
router.delete('/api/productos/:id', (req, res) => {
    const productos = require('./productos.json')
    const id = req.params.id
    const producto = productos.find(producto => bcrypt.compareSync(id, producto.id))
    const index = productos.indexOf(producto)
    productos.splice(index, 1)
    fs.writeFileSync('./productos.json', JSON.stringify(productos))
    res.send(producto)
})

// PUT a product from productos.json file by [hashed] id
router.put('/api/productos/:id', (req, res) => {
    const productos = require('./productos.json')
    const id = req.params.id
    const producto = productos.find(producto => bcrypt.compareSync(id, producto.id))
    const index = productos.indexOf(producto)
    productos[index] = req.body
    productos[index].id = id
    productos[index].id = bcrypt.hashSync(productos[index].id.toString(), 10)
    fs.writeFileSync('./productos.json', JSON.stringify(productos))
    res.send(producto)
})

// GET an html file to submit a new product thru a form in UI
router.get('/api/nuevo_producto', (req, res) => {
    res.sendFile(__dirname + '/public/html/submit.html')
    console.log('submit.html fue cargada exitosamente.')
})



