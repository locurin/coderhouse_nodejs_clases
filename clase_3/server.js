// dependencies: body-parser, express, handlebars, Router fs
const bodyParser = require('body-parser')
const express = require('express')
const { engine }  = require('express-handlebars')
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

// set up the handlebars engine
app.engine('hbs',
     engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts/',
        partialsDir: __dirname + '/views/partials/'
    })  
)
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

// GET root path
router.get('/', (req, res) => {
    res.render('home')
    console.log('index.html fue cargada exitosamente.')
})

// GET an array of object including all the products in the productos.json file
router.get('/productos', (req, res) => {
    const productos = require('./productos.json')
    if (productos.length === 0) {
        res.status(404).send({ mensaje: 'No existen productos en la base de datos.' })
        console.log('No existen productos en la base de datos.')
    } else {
        res.render('products', { productos : productos.slice(1) })
        console.log('Se han enviado los productos.')
    }
    
})

// POST a new product to the productos.json file with an added id
router.post('/productos', upload.none(), (req, res) => {
    const producto = req.body
    const productos = require('./productos.json')
    productos[0].totalProductos += 1
    producto.id = productos[0].totalProductos
    productos.push(producto)
    fs.writeFileSync('./productos.json', JSON.stringify(productos))
    res.redirect(`/productos/${producto.id}`)
})

// GET a single product object from productos.json file id and display or error if none is found

router.get('/productos/:id', (req, res) => {
    const productos = require('./productos.json')
    const id = Number(req.params.id)
    const producto = productos.find(producto => producto.id === id)
    if (producto) {
        res.render('product', { producto : producto })
        console.log(`Producto encontrado: ${producto.title}`)
    } else {
        res.status(404).send({ mensaje: 'Producto no encontrado' })
        console.log(`Producto no encontrado: ${id}`)
    }
})


// DELETE a product from productos.json file by id
router.delete('/productos/:id', (req, res) => {
    const productos = require('./productos.json')
    const id = Number(req.params.id)
    const producto = productos.find(producto => producto.id === id)
    const index = productos.indexOf(producto)
    productos.splice(index, 1)
    fs.writeFileSync('./productos.json', JSON.stringify(productos))
    res.send(producto)
})

// PUT a product from productos.json file by id
router.put('/productos/:id', (req, res) => {
    const productos = require('./productos.json')
    const id = Number(req.params.id)
    const producto = productos.find(producto => producto.id === id)
    const index = productos.indexOf(producto)
    productos[index] = req.body
    productos[index].id = id
    productos[index].id = bcrypt.hashSync(productos[index].id.toString(), 10)
    fs.writeFileSync('./productos.json', JSON.stringify(productos))
    res.send(producto)
})

// GET an html file to submit a new product thru a form in UI
router.get('/nuevo_producto', (req, res) => {
    res.render('submit_product')
    console.log('submit.html fue cargada exitosamente.')
})



