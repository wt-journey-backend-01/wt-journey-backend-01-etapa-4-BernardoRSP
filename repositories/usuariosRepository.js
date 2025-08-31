const db = require("../db/db.js");

// ----- Encontrar Usuário Cadastrado -----
async function encontrar(email) {
  const encontrado = await db("usuarios").where({ email }).first();
  return encontrado;
}

// ----- Registrar um Usuário no Sistema -----
async function registrar(usuario) {
  const [registrado] = await db("usuarios").insert(usuario).returning("*");
  return registrado;
}

// ----- Deletar a Conta de um Usuário -----
async function deletar(id) {
  const deletado = await db("usuarios")
    .where({ id: Number(id) })
    .del();
  return deletado;
}

// ----- Exports -----
module.exports = {
  encontrar,
  registrar,
  deletar,
};
