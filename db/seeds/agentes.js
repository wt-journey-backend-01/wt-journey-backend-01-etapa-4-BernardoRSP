/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

async function seed(knex) {
  // deleta:
  await knex("agentes").del();
  // popula:
  await knex("agentes").insert([
    { nome: "Bernardo Rezende", dataDeIncorporacao: "2023-05-11", cargo: "Investigador" },
    { nome: "Rommel Carneiro", dataDeIncorporacao: "2022-09-01", cargo: "Delegado" },
  ]);
}

module.exports = { seed };
