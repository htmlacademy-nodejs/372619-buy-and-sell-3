'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {
  API_PREFIX,
  HttpCode
} = require(`../../constants`);
const routes = require(`../api`);

const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());

app.use(API_PREFIX, routes);
app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [userPort] = args;
    const port = Number.parseInt(userPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера: ${err.message}`));
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    }
    );
  }
};
