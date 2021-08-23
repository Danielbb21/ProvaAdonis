'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GambleSchema extends Schema {
  up () {
    this.create('gambles', (table) => {
      table.increments()
      table.string('gameNumbers').notNullable()
      table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .notNullable()
      table
      .integer('game_id')
      .unsigned()
      .references('id')
      .inTable('games')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
      .notNullable()
      table.decimal('price').notNullable()
      table.timestamp('game_date')
      table.timestamps()
    })
  }

  down () {
    this.drop('gambles')
  }
}

module.exports = GambleSchema
