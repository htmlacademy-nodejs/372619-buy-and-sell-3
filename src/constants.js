'use strict';

const DEFAULT_COMMAND = `--help`;

// 3ий аргумент process.argv[2]
const USER_ARGV_INDEX = 2;

const MOCK_FILENAME = `mocks.json`;

const API_PREFIX = `/api`;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MOCK_FILENAME,
  API_PREFIX,
  ExitCode,
  HttpCode
};
