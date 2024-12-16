import express from "express";
import { formularioLogin, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword, autenticar, cerrarSesion, perfil, actualizarPerfil } from "../controllers/usuarioController.js";
import protegerRuta from "../middleware/protegerRuta.js"
import upload from "../middleware/subirImagen.js";


const router = express.Router();
//Routing
router.get('/login', formularioLogin);
router.post('/login', autenticar);

//cerrar sesión 

router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro);
router.post('/registro', upload.single('imagen'), registrar);

router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

//Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

router.get('/perfil', protegerRuta, perfil);
router.post('/perfil', protegerRuta, upload.single('imagen'), actualizarPerfil);

router.post('/subir-imagen-perfil',
    upload.single('file'),
    (req, res) => {
        console.log('Intentando subir imagen');
        console.log('Request file:', req.file);
        
        if (!req.file) {
            console.log('No se recibió ningún archivo');
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }
        
        console.log('Archivo subido exitosamente:', req.file.filename);
        return res.json({ imagen: req.file.filename });
    }
);



export default router