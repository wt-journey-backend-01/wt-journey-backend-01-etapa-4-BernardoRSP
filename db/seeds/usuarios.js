const bcrypt = require("bcrypt");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("usuarios").del();




  await knex("usuarios").insert([
    { nome: "Bernardo", email: "bernardo@email.com", senha: await bcrypt.hash("Belinha.1234", 10) },
    { nome: "Gustavo", email: "gustavo@email.com", senha: await bcrypt.hash("Juliana.321", 10) },
  ]);
};
