const { Pool } = require("pg");
const bcrypt = require('bcryptjs')


const pool = new Pool({
    host: "postgresql-cristobald.alwaysdata.net",
    user: "cristobald",
    password: "postgres",
    database: "cristobald_softjobs",
    port: 5432,
    allowExitOnIdle: true,
  });




  const getUsuarios = async () => {
    const { rows: usuarios } = await pool.query("SELECT * FROM usuarios");
    return usuarios;
  };
// registro de usuario con encriptado password

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, rol ,lenguage];
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
    await pool.query(consulta, values);
  };

  // proceso de login

  const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" }
    }


 // const verificarCredenciales = async (email, password) => {
 //   const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
 //   const values = [email, password]
  //  const { rowCount } = await pool.query(consulta, values)
  //  if (!rowCount)
  //  throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }
   // }
    

  module.exports = {
    getUsuarios, registrarUsuario,
    verificarCredenciales,
  
  };