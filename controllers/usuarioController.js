import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generateID, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'
import upload from '../middleware/subirImagen.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    //validación
    await check('email').isEmail().withMessage('El correo es un campo obligatorio').run(req)
    await check('password').notEmpty().withMessage('La contraseña es un campo obligatorio').run(req)

    let resultado = validationResult(req)

    //verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }


    const { email, password } = req.body
    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Error al Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no existe' }]
        })
    }

    //comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Error al Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no ha sido confirmada, por favor, accede al correo enviado y confirma la cuenta.' }]
        })
    }

    //Revisar el password
    if (!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Error al Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu contraseña es incorrecta' }]
        })
    }

    //Autenticar al usuario
    const token = generarJWT(
        { id: usuario.id, 
            nombre: usuario.nombre, 
            imagen: usuario.imagen
        });

    console.log(token);

    //Almacenar en un cookie

    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
    }).redirect('/mis-propiedades')

}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}


const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
    console.log(req.body)

    //validación
    await check('nombre').notEmpty().withMessage('El nombre es un campo obligatorio.').run(req)
    await check('email').isEmail().withMessage('Escribe un correo electrónico en un formato válido. Ej. usuario@dominio.com').run(req)
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 carácteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)
    await check('fechaNacimiento')
        .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
        .custom((value) => {
            const fechaNacimiento = new Date(value)
            const hoy = new Date()
            const edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
            const mes = hoy.getMonth() - fechaNacimiento.getMonth()
            
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--
            }
            
            if (edad < 18) {
                throw new Error('Debes ser mayor de edad para registrarte')
            }
            return true
        }).run(req)

    let resultado = validationResult(req)


    //verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                fechaNacimiento: req.body.fechaNacimiento
            }
        })
    }

    //Extraer los datos

    

    
    const { nombre, email, password, fechaNacimiento } = req.body
    let imagen = req.body.imagen

    if (!imagen) {
        imagen = 'default-profile.png'
    }

    //verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Error al Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Ya existe un usuario registrado con ese correo electrónico.' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                fechaNacimiento: req.body.fechaNacimiento
            }
        })
    }

    //let imagen = 'default-profile.png'
    if (req.file) {
        console.log('Archivo subido:', req.file);
        imagen = req.file.filename
    }

    //Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        fechaNacimiento,
        imagen: imagen || 'default-profile.png',
        token: generateID()
    })

    //Enviar email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    //Mostrar mensaje de confirmación
    res.render('templates/message', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace'
    })
}

//Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;

    //verificar si el token es valido

    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, inténtalo de nuevo',
            error: true
        })
    }

    //confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente'
    })


    console.log(usuario)
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperación de contraseña',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    //validación
    await check('email').isEmail().withMessage('Escribe un correo electrónico en un formato válido. Ej. usuario@dominio.com').run(req)

    let resultado = validationResult(req)
    //verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            pagina: 'Recuperación de contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //Buscar al usuario
    const { email } = req.body
    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Error al recuperar la contraseña',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El correo electrónico no pertenece a ningún usuario' }]
        })
    }

    //Generar un token y enviar el email
    usuario.token = generateID();
    await usuario.save();

    //Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })
    //Renderizar un mensaje
    res.render('templates/message', {
        pagina: 'Recuperación de contraseña',
        mensaje: `Hemos enviado un correo a ${email} para reestablecer la contraseña.`
    })

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al recuperar la contraseña',
            mensaje: 'Hubo un error al validar tu información, inténtalo de nuevo',
            error: true
        })
    }

    //mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Recuperación de contraseña',
        csrfToken: req.csrfToken()
    })

}

const nuevoPassword = async (req, res) => {
    //validar el password
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').run(req)

    let resultado = validationResult(req)

    //verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Crea una nueva contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { token } = req.params
    const { password } = req.body;

    //identificar quien hace el cambio
    const usuario = await Usuario.findOne({ where: { token } })

    //hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Contraseña reestablecida',
        mensaje: 'La nueva contraseña se guardó correctamente'
    })
}


const perfil = async (req, res) => {
    const { usuario } = req
    
    res.render('auth/perfil', {
        pagina: 'Mi Perfil',
        csrfToken: req.csrfToken(),
        usuario
    })
}

const actualizarPerfil = async (req, res) => {
    try {
        // Validaciones
        await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
        await check('email').isEmail().withMessage('Formato de email inválido').run(req)

        let resultado = validationResult(req)
        if (!resultado.isEmpty()) {
            return res.render('auth/perfil', {
                pagina: 'Mi Perfil',
                usuario: req.usuario,
                errores: resultado.array(),
                csrfToken: req.csrfToken()
            })
        }

        // Verificar que el email no existe
        const { nombre, email, imagen } = req.body
        
        // Debug para ver qué valores llegan
        console.log('Datos recibidos:', { nombre, email, imagen })

        const usuario = await Usuario.findByPk(req.usuario.id)

        if (email !== usuario.email) {
            const existeEmail = await Usuario.findOne({ where: { email }})
            if (existeEmail) {
                return res.render('auth/perfil', {
                    pagina: 'Mi Perfil',
                    usuario: req.usuario,
                    errores: [{msg: 'El email ya está en uso'}],
                    csrfToken: req.csrfToken()
                })
            }
        }

        // Actualizar usuario
        usuario.nombre = nombre
        usuario.email = email

        // Si hay una nueva imagen, actualizarla
        if (imagen && imagen !== usuario.imagen) {
            console.log('Actualizando imagen:', imagen)
            usuario.imagen = imagen
        }

        // Debug para ver qué se va a guardar
        console.log('Usuario a guardar:', usuario.toJSON())

        await usuario.save()
        
        // Debug para confirmar que se guardó
        console.log('Usuario guardado:', usuario.toJSON())

        // Redireccionar con mensaje de éxito
        res.redirect('/auth/perfil')

    } catch (error) {
        console.log(error)
        return res.render('auth/perfil', {
            pagina: 'Mi Perfil',
            usuario: req.usuario,
            errores: [{msg: 'Error al actualizar el perfil'}],
            csrfToken: req.csrfToken()
        })
    }
}


export {
    formularioLogin,
    cerrarSesion,
    formularioRegistro,
    autenticar,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    actualizarPerfil
}