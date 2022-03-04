'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS_COUNT = 4;

const FILE_NAME = `fill-db.sql`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const OfferType = {
  OFFER: `OFFER`,
  SALE: `SALE`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateComments = (count, comments, offerId, userCount) => (
  Array(count).fill({}).map(() => ({
    offerId,
    userId: getRandomInt(1, userCount),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = (count, categoryCount, userCount, titles, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(1, 5).join(` `),
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    price: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS_COUNT), comments, index + 1, userCount),
    userId: getRandomInt(1, userCount)
  }))
);

const readContent = async (filepath) => {
  try {
    const content = await fs.readFile(filepath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (e) {
    console.error(chalk.red(e));
    return [];
  }
};

const disableAllTableTrigger = (tableName, isDisabled = true) => {
  return `ALTER TABLE ${tableName} ${isDisabled ? `DISABLE` : `ENABLE`} TRIGGER ALL;`;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const offers = generateOffers(countOffer, categories.length, users.length, titles, sentences, commentSentences);

    const comments = offers.flatMap((offer) => offer.comments);

    const offerCategories = offers.map((offer, index) => ({offerId: index + 1, categoryId: offer.category[0]}));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const offerValues = offers.map(
        ({title, description, type, price, picture, userId}) =>
          `('${title}', '${description}', '${type}', ${price}, '${picture}', ${userId})`
    ).join(`,\n`);

    const offerCategoryValues = offerCategories.map(
        ({offerId, categoryId}) =>
          `(${offerId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, offerId}) =>
          `('${text}', ${userId}, ${offerId})`
    ).join(`,\n`);

    const content = `INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};

INSERT INTO categories(name) VALUES
${categoryValues};

${disableAllTableTrigger(`offers`)}
INSERT INTO offers(title, description, type, price, picture, user_id) VALUES
${offerValues};
${disableAllTableTrigger(`offers`, false)}

${disableAllTableTrigger(`offer_categories`)}
INSERT INTO offer_categories(offer_id, category_id) VALUES
${offerCategoryValues};
${disableAllTableTrigger(`offer_categories`, false)}

${disableAllTableTrigger(`comments`)}
INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
${commentValues};
${disableAllTableTrigger(`comments`, false)}`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
