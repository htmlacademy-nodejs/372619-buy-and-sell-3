'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  MOCK_FILENAME,
  HttpCode
} = require(`../../constants`);

const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(MOCK_FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (e) {
    res.send([]);
  }
});
app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [userPort] = args;
    const port = Number.parseInt(userPort, 10) || DEFAULT_PORT;

    app.listen(port, ({message}) => {
      if (message) {
        return console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    }
    );
  }
};
