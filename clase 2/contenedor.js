import { appendFileSync, readFileSync, writeFileSync } from 'fs'


// clase Contenedor y sus métodos
export class Contenedor {

    // atributos de la clase
    archivo = './productos.txt'
    idCounter = 0

    // actualiza el contador de id
    updateIdCounter = () => {
        return this.idCounter += 1
    }

    // agrega un producto al archivo y retorna su id
    save = producto => {
        producto.id = this.updateIdCounter()
        appendFileSync(this.archivo, `id: ${producto.id} - nombre: ${producto.nombre} - precio: $${producto.precio} - descripción: ${producto.descripcion}\n`)
        return `producto añadido: ${producto.id}`
    }

    // retorna un producto por id
    getById = numero => {
        let lineas = readFileSync(this.archivo, 'utf-8').split('\n')
        for (let i = 0; i < lineas.length; i++) {
            if (lineas[i].includes(`id: ${numero}`)) {
                return `el producto N° ${numero} es: ${lineas[i]}`
            }
        }
        return `el producto N° ${numero} no existe`
    }

    // retorna un array con todos los productos
    getAll = () => {
        let lineas = readFileSync(this.archivo, 'utf-8').split('\n')
        let productos = []
        for (let i = 0; i < lineas.length - 1; i++) {
            let producto = lineas[i]
            productos.push(producto)
        }
        return productos
    }

    // elimina un producto por id
    deleteById = numero => {
        if (numero > this.idCounter) {
            return `el producto N° ${numero} no existe`
        }
        let lineas = readFileSync(this.archivo, 'utf-8').split('\n')
        for (let i = 0; i < lineas.length; i++) {
            if (lineas[i].includes(`id: ${numero}`)) {
                console.log(lineas[i] + ' <---------- ha sido eliminado del archivo.')
                lineas.splice(i, 1)
            }
        }
        writeFileSync(this.archivo, lineas.join('\n'))
    }

    //elimina todos los productos
    deleteAll = () => {
        writeFileSync(this.archivo, '')
        console.log('todos los productos han sido eliminados del archivo.')
    }

}



