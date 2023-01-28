const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken")
const { getUsuarios, registrarUsuario, verificarCredenciales } = require("./consultas");

app.listen(3000, console.log("SERVER ON"));
app.use(cors());
app.use(express.json());


// visualizacion front-end
app.use(express.static('build'))
app.get('/', (res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

// registrar usuario con contraseña encriptada

app.post("/usuarios", async (req, res) => {
    try {
    const usuario = req.body
    await registrarUsuario(usuario)
    res.send("Usuario creado con éxito")
    } catch (error) {
    res.status(500).send(error)
    }
    })

//verificar login correcto




app.post("/login", async (req, res) => {
    try {
    const { email, password } = req.body
    await verificarCredenciales(email, password)
    const token = jwt.sign({ email }, "az_AZ")
    res.send(token)
    } catch (error) {
    console.log(error)
    res.status(error.code || 500).send(error)
    }
    })
    
