// declara la clase productos
class Producto {
    constructor(nombre, precio, descripcion) {
        this.nombre = nombre
        this.precio = precio
        this.descripcion = descripcion
    }
}

// declara un array de objetos Producto y lo exporta para poder ser utilizado en otros archivos
export const productos = [
    new Producto('Camisa', 20, 'Camisa de hombre'),
    new Producto('Pantalon', 30, 'Pantalon de hombre'),
    new Producto('Zapatos', 40, 'Zapatos de hombre'),
    new Producto('Bolsa', 50, 'Bolsa de hombre'),
    new Producto('Reloj', 60, 'Reloj de hombre')
]

