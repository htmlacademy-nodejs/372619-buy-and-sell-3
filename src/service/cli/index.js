'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const fill = require(`./fill`);
const server = require(`./server`);

const Cli = [help, version, generate, fill, server].reduce((result, module) => {
  result[module.name] = module;
  return result;
}, {});

module.exports = {
  Cli
};
