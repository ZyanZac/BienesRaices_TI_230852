import bcrypt from 'bcrypt'
const usuarios = [
    {
        nombre: 'Esperanza',
        email: '',
        confirmado: 1,
        fechaNacimiento: 2000/12/12,
        imagen: 'default.jpg',
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios