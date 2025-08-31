const bcrypt = require("bcrypt");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

async function seed(knex) {
  // deleta:
  await knex("usuarios").del();
  // popula:
  await knex("usuarios").insert([
    { nome: "Bernardo", email: "bernardo@email.com", senha: await bcrypt.hash("Belinha.1234", 10) },
    { nome: "Gustavo", email: "gustavo@email.com", senha: await bcrypt.hash("Juliana.321", 10) },
  ]);
}

module.exports = { seed };
