/* this script is written to be runnable with node >=0.10.0 */
/* global exports process require */

require('colors');
var semver = require('semver');

function log(mark, str, which) {
  var _which = which || 'log';
  console[_which](mark, str.filter(function (s) { return s; }).join(' '));
};
exports.log = log;

function logError() {
  var str = Array.prototype.slice.call(arguments);
  log(('✘').red, str, 'error');
}
exports.logError = logError;

function logInfo() {
  var str = Array.prototype.slice.call(arguments);
  log(('ℹ').blue, str, 'log');
}
exports.logInfo = logInfo;

function logSuccess() {
  var str = Array.prototype.slice.call(arguments);
  log(('✔').green, str, 'log');
}
exports.logSuccess = logSuccess;

function logWarn() {
  var str = Array.prototype.slice.call(arguments);
  log(('‼︎').yellow, str, 'warn');
}
exports.logWarn = logWarn;

var encountered = 'encountered an error';

function pkgNameCyanMaybeWithSpace(pkgJson) {
  return pkgJson.name ? pkgJson.name.cyan + ' ' : '';
}

function enforceRuntimeNodeVersion(pkgJsonPath) {
  var pkgJson = {};
  try {
    pkgJson = require(pkgJsonPath);
    var procVer = semver.clean(process.version);
    var range;
    try {
      range = pkgJson.runtime.engines.node;
    } catch (e) {
      range = '';
    }
    if (range && !semver.satisfies(procVer, range)) {
      var message = [
        pkgNameCyanMaybeWithSpace(pkgJson),
        'does not support node ',
        procVer.red,
        ', version ',
        range.green,
        ' is required'
      ].join('');
      exitWithError(null, message);
    }
  } catch (err) {
    exitWithError(
      null,
      pkgNameCyanMaybeWithSpace(pkgJson) + encountered,
      err
    );
  }
}

exports.enforceRuntimeNodeVersion = enforceRuntimeNodeVersion;

function exitWithError(pkgJsonPath, message, err) {
  var pkgJson = {};
  try {
    if (pkgJsonPath) {
      pkgJson = require(pkgJsonPath);
      logError(pkgNameCyanMaybeWithSpace(pkgJson) + encountered);
    }
    if (message) logError(message);
    if (err) console.error(err);
    if (!(pkgJsonPath || message || err)) logError(encountered);
    process.exit(1);
  } catch (err) {
    exitWithError(
      null,
      pkgNameCyanMaybeWithSpace(pkgJson) + encountered,
      err
    );
  }
}

exports.exitWithError = exitWithError;
