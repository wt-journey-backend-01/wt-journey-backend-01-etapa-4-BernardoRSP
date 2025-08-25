/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("usuarios").del();

  await knex("usuarios").insert([
    { nome: "Bernardo", email: "bernardo@email.com", senha: "juliana1234" },
    { nome: "Gustavo", email: "gustavo@email.com", senha: "bananacomChocolate123" },
  ]);
};
