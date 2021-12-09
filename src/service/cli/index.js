'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);

const Cli = [help, version, generate].reduce((result, module) => {
  result[module.name] = module;
  return result;
}, {});

module.exports = {
  Cli
};
