import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js'

Propiedad.belongsTo(Precio, { foreignKey: 'precioID' })
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaID' })
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioID' })
//Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadID' })

//Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadID' })
//Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioID' })

Propiedad.hasMany(Mensaje, { 
    foreignKey: 'propiedadID',
    sourceKey: 'id',
    as: 'mensajes'  // Nombre en plural porque una propiedad tiene muchos mensajes
})

Mensaje.belongsTo(Propiedad, { 
    foreignKey: 'propiedadID',
    targetKey: 'id',
    as: 'propiedad'  // Nombre en singular porque un mensaje pertenece a una propiedad
})

Mensaje.belongsTo(Usuario, { 
    foreignKey: 'usuarioID',
    as: 'usuario'  // Nombre en singular porque un mensaje pertenece a un usuario
})


export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}