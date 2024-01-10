// Importa el módulo Express, que se utiliza para crear una aplicación web.
const express = require("express");
// Importa el módulo express-session, que se utiliza para gestionar sesiones de usuario.
const session = require("express-session");
// Crea una instancia de la aplicación Express.
const app = express();
// Importa el módulo mysql, que se utiliza para interactuar con una base de datos MySQL.
const mysql = require("mysql");
// Importa el módulo cors, que se utiliza para habilitar el Cross-Origin Resource Sharing (CORS) en la aplicación.
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Configuración de middleware para manejar CORS (Cross-Origin Resource Sharing).
app.use(cors());
// Configuración de middleware para analizar solicitudes JSON.
app.use(express.json());
// Configuración de cookies Parser
app.use(cookieParser());
// Configuración de middleware de sesión.
app.use(session({
    secret: "Bethel1905", // Clave secreta para firmar las cookies de sesión.
    resave: false, // Evita que la sesión se guarde en cada solicitud.
    saveUninitialized: true // Permite que las sesiones se almacenen aunque estén vacías.
}));

// Creación de conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "facturacion"
});

// Recibe y envía los datos a la tabla de usuarios
app.post("/Enviar", (req, res) => {
    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    // Verifica si el usuario o el correo ya existen
    db.query('SELECT * FROM usuarios WHERE usuario = ? OR correo = ?', [usuario, correo], (err, rows) => {
        if(err) {
            console.log(err);
            res.json({ success: false, message: "Error al verificar el usuario o correo"});
        } else if(rows.length > 0) {
            // Usuario o Correo ya existen en la base de datos
            res.json({ success: false, message: "El usuario o correo ingresado ya se encuentran registrados"});
        } else {
            // No se encontraron coincidencias, se registra el usuario
            db.query('INSERT INTO usuarios(nombre, correo, usuario, contrasena) VALUES (?,?,?,?)', [nombre, correo, usuario, contrasena], (err, result) => {
                if(err) {
                    console.log(err);
                    res.json({ success: false, message: "Error al registrar el usuario"});
                } else {
                    res.json({ success: true, message: "Usuario registrado con éxito" });
                }
            });
        }
    });
});

// Inicio y Validación de sesión
app.post("/Entrar", (req, res) => {
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    const values = [ usuario, contrasena ];

    db.query("SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?", values,
    (err, result) => {
        if (err) {
            console.error(err);
            return;
        } else {
            // Almacena los datos del usuario en la sesión
            if (result.length > 0) {
                req.session.user = {
                    id: result[0].id_usuario,
                    nombre: result[0].nombre,
                    correo: result[0].correo
                };
                res.status(200).send({
                    "id": result[0].id_usuario,
                    "nombre": result[0].nombre,
                    "correo": result[0].correo
                });
            } else {
                res.status(400).send("Usuario no encontrado");
            }
        }
    });
});

// Cerrar sesión del usuario
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.error(err);
        } else {
            res.redirect('/'); // Redirige a la pagina principal
        }
    });
});

// Endpoint para verificar las credenciales
app.post("/verificarCredenciales", (req, res) => {
    const correo = req.body.correo;
    const usuario = req.body.usuario;

    // Realizar la verificación de credenciales en la base de datos
    db.query("SELECT * FROM usuarios WHERE correo = ? AND usuario = ?", [correo, usuario], (err, result) => {
            if (err) {
                console.error("Error al verificar las credenciales", err);
                res.status(500).json({ success: false, message: "Error interno del servidor" });
            } else {
                if (result.length > 0) {
                    // Credenciales correctas
                    res.json({ success: true });
                } else {
                    // Credenciales incorrectas
                    res.json({ success: false });
                }
            }
        }
    );
});

// Cambiar contraseña
app.post("/cambiarContrasena", (req, res) => {
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    // Actualiza la contraseña del usuario en la base de datos
    db.query('UPDATE usuarios SET contrasena = ? WHERE usuario = ?', [contrasena, usuario], (err, result) => {
        if(err) {
            console.log(err);
            res.json({ success: false, message: "Error al cambiar la contraseña"});
        } else {
            res.json({ success: true, message: "Contraseña cambiada con éxito" });
        }
    });
});

/* Envió de factura a la base de datos */
app.post('/CreateFactura', (req, res) => {
    const { fecha, cliente, cedulaNit, descripcion, cantidad, precioUnitario, precioTotal } = req.body;

    // Consulta SQL para insertar en la tabla 'facturas':
    const insertQuery = "INSERT INTO facturas (fecha, cliente, cedulaNit, descripcion, cantidad, precioUnitario, precioTotal) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(insertQuery, [fecha, cliente, cedulaNit, descripcion, cantidad, precioUnitario, precioTotal], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear la factura' });
        } else {
            res.status(200).json({ message: 'Factura creada exitosamente' });
        }
    });
});

/* Ruta para obtener todos los datos de la tabla facturas */
app.get("/Facturas", (req, res) => {
    const query = "SELECT * FROM facturas";
    db.query(query, (error, results) => {
        if(error){
            console.error("Error al obtener los datos de la tabla facturas", error);
            res.status(500).json({ error: "Error interno del servidor" });
        } else {
            res.status(200).json(results);
        }
    });
});

// Mensaje de bd Activa
app.listen(3001,() => {
    console.log("Corriendo en el puerto 3001")
});
