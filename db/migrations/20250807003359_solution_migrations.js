/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema
    .createTable("agentes", (table) => {
      table.increments("id").primary();
      table.string("nome").notNullable();
      table.date("dataDeIncorporacao").notNullable();
      table.string("cargo").notNullable();
    })
    .then(() =>
      knex.schema.createTable("casos", (table) => {
        table.increments("id").primary();
        table.string("titulo").notNullable();
        table.string("descricao").notNullable();
        table.string("status").notNullable(); // aberto/solucionado
        table.integer("agente_id").references("id").inTable("agentes").nullable().onDelete("set null");
      })
    )
    .then(() =>
      knex.schema.createTable("usuarios", (table) => {
        table.increments("id").primary();
        table.string("nome").notNullable();
        table.string("email").unique().notNullable();
        table.string("senha").notNullable();
      })
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTable("casos").dropTable("agentes").dropTable("usuarios");
};
