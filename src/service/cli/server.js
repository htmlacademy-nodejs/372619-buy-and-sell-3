'use strict';

const fs = require(`fs`).promises;
const http = require(`http`);
const chalk = require(`chalk`);

const {
  MOCK_FILENAME,
  httpCode
} = require(`../../constants`);

const DEFAULT_PORT = 3000;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });
  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`: {
      try {
        const fileContent = await fs.readFile(MOCK_FILENAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, httpCode.OK, `<ul>${message}</ul>`);
      } catch (e) {
        sendResponse(res, httpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    }

    default: {
      sendResponse(res, httpCode.NOT_FOUND, notFoundMessageText);
      break;
    }
  }
};


module.exports = {
  name: `--server`,
  run(args) {
    const [userPort] = args;
    const port = Number.parseInt(userPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, () => {
        console.info(chalk.green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  }
};
