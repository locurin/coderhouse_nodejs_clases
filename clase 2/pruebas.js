import { Contenedor } from './contenedor.js'
import { productos } from './productos.js'

// nuevo Objeto Contenedor
const pruebas = new Contenedor()

// agrega todos los productos al archivo productos.txt
for (const producto of productos) {
    console.log(pruebas.save(producto))
}

// demostración de los metodos de Contenedor
pruebas.deleteById(3)

console.log(pruebas.getAll())

console.log(pruebas.getById(2))

// ACLARACIÓN: DESCOMENTAR LA SIGUIENTE LINEA PARA PROBAR EL MÉTODO deleteAll()
//pruebas.deleteAll()