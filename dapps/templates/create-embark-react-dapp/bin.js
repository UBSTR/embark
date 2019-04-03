#!/usr/bin/env node
/* this script is written to be runnable with node >=0.10.48 */
/* global __dirname process require */

require('colors');
var path = require('path');
var semver = require('semver');

function log(mark, str, which) {
  var _which = which || 'log';
  console[_which](mark, str.filter(function (s) { return s; }).join(' '));
}

function logError() {
  var str = Array.prototype.slice.call(arguments);
  log(('✘').red, str, 'error');
}

var pkgJson = require(path.join(__dirname, 'package.json'));
var procVer = semver.clean(process.version);
var range = pkgJson.runtime.engines.node;
if (!semver.satisfies(procVer, pkgJson.runtime.engines.node)) {
  logError([
    pkgJson.name.cyan,
    ' does not support node ',
    procVer.red,
    ', version ',
    range.green,
    ' is required'
  ].join(''));
  process.exit(1);
}

function exitWithError(err) {
  logError(pkgJson.name.cyan + ' encountered an error');
  console.error(err);
  process.exit(1);
}

//try {
  require('source-map-support/register');
  var wrappedCliPkgName = 'create-react-app';
  require('./dist').create(
    null,
    path.join(__dirname, 'dist/cli-program'),
    'Create Embark React Dapp'
  ).catch(function (err) {
    exitWithError(err);
  });
/* } catch (err) {
  exitWithError(err);
 }*/
