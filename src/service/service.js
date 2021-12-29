'use strict';

const {Cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../constants`);

const userArgs = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArgs;

if (!userArgs.length || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.SUCCESS);
}

Cli[userCommand].run(userArgs.slice(1));
