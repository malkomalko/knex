'use strict';

var Raw = require('./raw');
var warn = require('./helpers').warn;
var Client = require('./client');

var makeClient = require('./util/make-client');
var makeKnex = require('./util/make-knex');
var parseConnection = require('./util/parse-connection');
var assign = require('lodash/object/assign');

function Knex(config) {
  if (typeof config === 'string') {
    return new Knex(assign(parseConnection(config), arguments[2]));
  }
  var Dialect = makeClient(require('./dialects/postgres/index.js'));
  if (typeof config.connection === 'string') {
    config = assign({}, config, { connection: parseConnection(config.connection).connection });
  }
  return makeKnex(new Dialect(config));
}

// Expose Client on the main Knex namespace.
Knex.Client = Client;

// Run a "raw" query, though we can't do anything with it other than put
// it in a query statement.
Knex.raw = function (sql, bindings) {
  return new Raw({}).set(sql, bindings);
};

// Create a new "knex" instance with the appropriate configured client.
Knex.initialize = function (config) {
  warn('knex.initialize is deprecated, pass your config object directly to the knex module');
  return new Knex(config);
};

// Bluebird
Knex.Promise = require('./promise');

module.exports = Knex;
