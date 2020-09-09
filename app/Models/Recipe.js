'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Recipe extends Model {
  steps () {
    return this.hasMany('App/Models/Step', 'id', 'recipe')
  }
}

module.exports = Recipe
