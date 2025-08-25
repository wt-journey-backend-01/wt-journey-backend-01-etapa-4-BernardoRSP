const db = require("../db/db.js");

// Encontrar Usuário Cadastrado
async function encontrar(email) {
  const encontrado = await db("usuarios").where({ email }).first();
  return encontrado;
}

// Registrar um Usuário no Sistema
async function registrar(usuario) {
  const registrado = await db("usuarios").insert(usuario).returning("*");
  console.log("registradoRepository");
  console.log(registrado);
  return registrado;
}

// Logar um Usuário Cadastrado no Sistema
async function logar(usuario) {}

// Deletar a Conta de um Usuário
async function deletar(id) {
  const deletado = await db("usuarios")
    .where({ id: Number(id) })
    .del();
  return deletado;
}

// Deslogar um Usuário Cadastrado no Sistema
async function deslogar() {}

module.exports = {
  encontrar,
  registrar,
  logar,
  deletar,
  deslogar,
};
