'use strict';

const fs = require(`fs`).promises;
const {
  MOCK_FILENAME,
} = require(`../../constants`);

let data = [];

const getMockData = async () => {
  if (data.length) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(MOCK_FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error(err);
    return err;
  }

  return data;
};

module.exports = getMockData;

