/**
 * Define all of the node_modules to include
 */

exports.callable = require('callable-object')
exports.Route = require('route-parser')

/**
 * Use browserify to bundle the node modules:
 * 
 * browserify --standalone bundle src/import/exports.js -o src/import/browserified.js
 */
